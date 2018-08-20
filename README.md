# queueprocessor
Process queued items from SQS via Aws lambda function and put them in S3 bucket as a we page.

Installation:

-   Node.js
-   AWS CLI
-   Serverless framework: `npm install -g serverless`

Setup:

-   Create an user in AWS IAM with apt rights eg: sls-usr.
-   Configure Serverless framework in your system with the user profile (created in previous step) by providing key and secret:
    `serverless config credentials --provider aws --key key-created-for-sls-usr --secret sls-usr-secret --profile sls-user-name`

Create a lambda function by using `serverless create`:

`
sls create --template aws-nodejs
sls create -t aws-nodejs
sls create -t aws-nodejs --path folder-path
`

Open serverless.yml :
Check service, providers (name, runtime, profile: sls-user-name, region)

To deploy:
`sls deploy -v`

---

To locally debug via VS Code:
- Install serverless as a dev dependency `npm install serverless -D`
- Add launch.json in .vscode:
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug process",
            "program": "${workspaceFolder}\\node_modules\\serverless\\bin\\serverless",
            "args": ["invoke", "local", "-f", "process", "--data", "{}"]
        }
    ]
}
```
