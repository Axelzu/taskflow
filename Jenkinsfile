@Library('ci-lib') _

pipeline {
    agent any

    tools {
        nodejs 'node-lts'
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
        disableConcurrentBuilds(abortPrevious: true)
        durabilityHint('PERFORMANCE_OPTIMIZED')
    }

    environment {
        GITHUB_REPO          = 'Axelzu/taskflow'
        npm_config_cache     = "${env.JENKINS_HOME}/caches/npm"
        CYPRESS_CACHE_FOLDER = "${env.JENKINS_HOME}/caches/cypress"
        DEPLOY_DIR           = "${env.JENKINS_HOME}/deployments/taskflow"
        CI                   = 'true'
    }

    stages {
        stage('Build') {
            steps {
                githubStatus('pending', "Build #${env.BUILD_NUMBER} en curso")
                echo "Rama: ${env.BRANCH_NAME} | Commit: ${env.GIT_COMMIT}"
                npmInstall()
                runCmd 'npm run build'
                archiveArtifacts artifacts: '*.tgz', fingerprint: true
            }
        }

        stage('Calidad y pruebas') {
            failFast true
            parallel {
                stage('Lint (ESLint)') {
                    steps { runCmd 'npm run lint' }
                }
                stage('Pruebas unitarias') {
                    environment {
                        JEST_JUNIT_OUTPUT_DIR  = 'reports/junit'
                        JEST_JUNIT_OUTPUT_NAME = 'unit.xml'
                    }
                    steps { runCmd 'npm run test:unit' }
                }
                stage('Pruebas de API') {
                    environment {
                        JEST_JUNIT_OUTPUT_DIR  = 'reports/junit'
                        JEST_JUNIT_OUTPUT_NAME = 'api.xml'
                    }
                    steps { runCmd 'npm run test:api' }
                }
                stage('Auditoría de dependencias') {
                    steps { runCmd 'npm audit --omit=dev --audit-level=high' }
                }
            }
        }

        stage('Análisis SonarQube') {
            when {
                anyOf { branch 'main'; changeRequest() }
            }
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarCloud') {
                        runCmd(isUnix() ? "${scannerHome}/bin/sonar-scanner"
                                     : "${scannerHome}\\bin\\sonar-scanner.bat")
                    }
                }
            }
        }

        stage('Pruebas E2E (Cypress)') {
            when {
                anyOf {
                    branch 'main'
                    changeRequest target: 'main'
                    allOf {
                        branch 'develop'
                        anyOf { changeset 'src/**'; changeset 'public/**'; changeset 'cypress/**' }
                    }
                }
            }
            steps {
                script {
                    def port = 3000 + (env.EXECUTOR_NUMBER as Integer)
                    withEnv(["PORT=${port}",
                             "CYPRESS_BASE_URL=http://localhost:${port}",
                             "DATA_FILE=${env.WORKSPACE}/tmp/e2e-tasks.json"]) {
                        runCmd "npx start-server-and-test start http://localhost:${port}/api/health cypress:run"
                    }
                }
            }
        }

        stage('Deploy a staging') {
            when { branch 'develop' }
            steps { runCmd 'node scripts/deploy.js staging' }
        }

        stage('Deploy a producción') {
            when { branch 'main' }
            steps { runCmd 'node scripts/deploy.js production' }
        }
    }

    post {
        always {
            junit testResults: 'reports/**/*.xml', allowEmptyResults: true
            archiveArtifacts artifacts: 'coverage/**/lcov-report/**', allowEmptyArchive: true
        }
        success  { githubStatus('success', 'Pipeline OK') }
        unstable { githubStatus('failure', 'Hay pruebas fallidas') }
        failure  { githubStatus('failure', 'Falló el pipeline') }
        aborted  { githubStatus('error', 'Pipeline cancelado') }
        cleanup  { cleanWs(deleteDirs: true, notFailBuild: true) }
    }
}
