1. Give the workflow a name

```yaml
name: "CI Workflow Name"
```

2. Install dependencies

```bash
npm install
```

last. Full YAML Code

```yaml
name: "ci workflow"

on:
  workflow_dispatch: 
  push:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repository code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'

      - name: Install dependencies
        run: npm install

      - name: Run automated tests
        run: npm test --if-present
```

The end
