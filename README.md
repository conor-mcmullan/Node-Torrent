# ppra Testing Suite
## Installation
Installation instructions organized by target deployment environment

Required prequisites:

- Python @ [Version](.python-version)

### Local Machine
Recommended Prerequisites:

- Setup && activate a virtual python environment for this application

```bash
$ make install
```

## Dependencies
### Environment Variables
| Name            | Example    | Description                                                                                                                                                                                            |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| SUT_ENVIRONMENT | rst_local | The deployment-environment where the [system under test](https://en.wikipedia.org/wiki/System_under_test#:~:text=System%20under%20test%20(SUT)%20refers,like%20stubs%20or%20even%20mocks.) is running|

### Libraries
#### Install Dependencies
``` bash
$ make install-lib-deps
```

#### Update (and Lock) Dependencies
``` bash
$ make update-lib-deps
```

## Running Application
Instructions for running this application organized by target deployment environment

### Pre Requisite

#### ENVRC
- Your `.envrc` file if using direnv should be at the root and cotain the following below. 
- Just ensure your BLACKLIST matches the prod namespace BLACKLIST found in the k8s config map for the app!
```env 
export BLACKLIST='[
                    "productA_denyable_measurement",
                    "'"${USER}_blacklisted_prvsts_fake"'"
                ]'


export NUM_OF_BATCHES=1
export BATCH_SIZE=1
export PRODUCT="${USER}"
export MEASUREMENT="prvsts_fake"
export CONFIG_FOR_MIXED_RECORD_TYPES='[
                                        (
                                            "'"$USER"'", [
                                                                "accepted_prvsts_fake",
                                                                "blacklisted_prvsts_fake"
                                            ]
                                        ),
                                        (
                                            "productA", [
                                                                "acceptable_measurement",
                                                                "denyable_measurement"
                                            ]
                                        )
                                    ]'

```


### Local Machine

#### Outside Container
```bash
$ make run

# Specific test case
$ pytest --capture=no ppra_testing_suite/test_cases/_1
```

#### Inside Container
```bash
# Infer version-to-run from latest commit tag:
$ make run-container-img-amd64

# Explicitly pass version-to-run:
$ export BUILD_VERSION="0.0.1"
$ make run-container-img-amd64
```

## Testing
```bash
$ make test
```

## Delivery
### Build Artifact Versioning
Instructions for building this applications "build artifacts" - organized by type of artifact.

The "build process" for this app is implemented using "build scripts", which are found [here](scripts/build)

The build process needs to know what version of the app you are building - the "Build Version".

The default "build version resolution behaviour" is to assume that the name of the latest *annotated tag* from the *current commit* on the *current branch* is the version you want to build.

You can add an annotated tag to your latest commit like so:
```bash
$ git tag -a ${BUILD_VERSION} -m ''

# Example:
$ git tag -a 0.1 -m ''
```

This default build version resolution behaviour can be overridden by using an environment variable.

This will cause all artifacts to be built @ the version you explicitly specify:
```bash
$ export BUILD_VERSION='${VERSION_STRING}'
$ make

# Example:
$ export BUILD_VERSION='0.1'
$ make
```

### Build
```bash
$ make
```

### Publish (Build Artifacts)
``` bash
$ make publish
```

