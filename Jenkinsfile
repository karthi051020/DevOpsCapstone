pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_REPO        = 'karthi051020/devops-capstone-proj'
        IMAGE_TAG             = "build-${BUILD_NUMBER}"
        APP_EC2_USER          = 'ubuntu'
        APP_EC2_HOST          = 'your-app-ec2-public-ip'
        CONTAINER_NAME        = 'nodejs-app'
        APP_PORT              = '3000'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/karthi051020/DevOpsCapstone.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKERHUB_REPO}:${IMAGE_TAG} ."
                sh "docker tag ${DOCKERHUB_REPO}:${IMAGE_TAG} ${DOCKERHUB_REPO}:latest"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
                sh "docker push ${DOCKERHUB_REPO}:${IMAGE_TAG}"
                sh "docker push ${DOCKERHUB_REPO}:latest"
            }
        }

        stage('Deploy to App EC2') {
            steps {
                sshagent(credentials: ['app-ec2-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${APP_EC2_USER}@${APP_EC2_HOST} '
                            docker pull ${DOCKERHUB_REPO}:latest &&
                            docker stop ${CONTAINER_NAME} || true &&
                            docker rm   ${CONTAINER_NAME} || true &&
                            docker run -d \
                                --name ${CONTAINER_NAME} \
                                -p ${APP_PORT}:${APP_PORT} \
                                --restart unless-stopped \
                                ${DOCKERHUB_REPO}:latest
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful — image: ${DOCKERHUB_REPO}:${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed — check the logs above"
        }
        always {
            sh 'docker logout || true'
        }
    }
}
