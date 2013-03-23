## Instructions

This example will create an example table and populate it with a Dino model.

### 1. Install dependencies

```
$ npm install
```

### 2. Create a file `./aws-config.json` and add your credentials

```json
{
  "accessKeyId": "YOUR_KEY",
  "secretAccessKey": "YOUR_SECRET",
  "region": "us-east-1"
}
```

### 3. Create an example table

```
$ node setup
```

### 3. Run the example

```
$ node example
```