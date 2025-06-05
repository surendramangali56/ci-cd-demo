pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', credentialsId: '<github-credential-id>', url: 'https://github.com/<your-username>/my-app.git'
            }
        }
        stage('Build') {
            steps {
                sh 'npm install'  // Example for Node.js
                sh 'npm run build'
            }
        }
        stage('Test') {
            parallel {
                stage('Unit Tests') {
                    steps {
                        sh 'npm test'
                    }
                }
                stage('Integration Tests') {
                    steps {
                        sh 'npm run integration-test'
                    }
                }
            }
        }
        stage('Deploy to S3') {
            steps {
                withAWS(credentials: '<aws-credential-id>', region: 'us-east-1') {
                    sh 'aws s3 sync ./build/ s3://<your-bucket-name>'
                }
            }
        }
    }
    post {
        always {
            archiveArtifacts artifacts: 'build/', allowEmptyArchive: true
            cleanWs()
        }
    }
}
