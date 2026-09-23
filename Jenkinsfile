pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Build & Test') {
            steps {
                dir('backend') {
                    bat 'mvnw.cmd clean package'
                }
            }
            post {
                always {
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                }
                success {
                    archiveArtifacts artifacts: 'backend/target/*.war', fingerprint: true
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    bat 'npm ci'
                    bat 'npm run build'
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'frontend/dist/**/*', fingerprint: true
                }
            }
        }

        stage('E2E UI Tests') {
            environment {
                EDGEDRIVER_PATH = 'C:/tools/webdriver/msedgedriver.exe'
                PYTHON_EXE = 'C:/Users/sahil/AppData/Local/Programs/Python/Python311/python.exe'
            }
            steps {
                bat '''
                    "%PYTHON_EXE%" -m venv venv
                    venv\\Scripts\\python.exe -m pip install -r tests\\ui\\requirements.txt
                '''
                dir('backend') {
                    bat '''
                        powershell -Command "$proc = Start-Process cmd.exe -ArgumentList '/c mvnw.cmd spring-boot:run -P e2e -Dspring-boot.run.profiles=e2e > backend-startup.log 2>&1' -PassThru -WindowStyle Hidden; $proc.Id | Out-File backend.pid"
                    '''
                }
                dir('frontend') {
                    bat '''
                        powershell -Command "$proc = Start-Process cmd.exe -ArgumentList '/c npm run dev > frontend-startup.log 2>&1' -PassThru -WindowStyle Hidden; $proc.Id | Out-File frontend.pid"
                    '''
                }
                bat '''
                    powershell -Command "$retry = 0; Write-Host 'Waiting for Backend (/actuator/health)...'; while($true) { try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/actuator/health' -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host 'Backend ready.'; break } } catch { }; if($retry -gt 30) { Write-Host 'Backend startup logs:'; Get-Content backend/backend-startup.log; throw 'Backend failed to start' }; $retry++; Start-Sleep 2 }"
                '''
                bat '''
                    powershell -Command "$retry = 0; Write-Host 'Waiting for Frontend (5173)...'; while($true) { try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -ErrorAction Stop; if ($response.StatusCode -eq 200) { Write-Host 'Frontend ready.'; break } } catch { }; if($retry -gt 30) { Write-Host 'Frontend startup logs:'; Get-Content frontend/frontend-startup.log; throw 'Frontend failed to start' }; $retry++; Start-Sleep 2 }"
                '''
                bat '''
                    venv\\Scripts\\python.exe -m pytest tests\\ui\\test_ui.py --junitxml=tests\\ui\\results.xml
                '''
            }
            post {
                always {
                    dir('backend') {
                        bat '''
                            powershell -Command "if (Test-Path backend.pid) { try { taskkill /T /F /PID (Get-Content backend.pid) 2> $null } catch {}; Remove-Item backend.pid -ErrorAction SilentlyContinue }"
                        '''
                    }
                    dir('frontend') {
                        bat '''
                            powershell -Command "if (Test-Path frontend.pid) { try { taskkill /T /F /PID (Get-Content frontend.pid) 2> $null } catch {}; Remove-Item frontend.pid -ErrorAction SilentlyContinue }"
                        '''
                    }
                    script {
                        if (fileExists('tests/ui/results.xml')) {
                            junit testResults: 'tests/ui/results.xml'
                        } else {
                            // Using echo instead of error ensures we don't throw a new exception
                            // that masks the original failure (e.g. backend failed to start)
                            echo "WARNING: JUnit XML report is missing. E2E tests likely failed to start or pytest crashed."
                        }
                    }
                    archiveArtifacts artifacts: 'tests/ui/*.png', allowEmptyArchive: true, fingerprint: true
                    archiveArtifacts artifacts: 'backend/backend-startup.log, frontend/frontend-startup.log', allowEmptyArchive: true
                }
            }
        }
    }
}
