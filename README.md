# sfpkgtools
SFDX Plugin to help with Unlocked Packages

### Install as plugin

    sfdx plugins:install sfpkgtools

<!-- commands -->
## info
sfdx sfpkgtools:info -v devhub -n core -m 1.28.0.1 -b
#installed
sfdx sfpkgtools:installed -u sfdxsit1 

## release report
sfdx sfpkgtools:release:report -v devhub -u mysitenv 

## validate
sfdx sfpkgtools:create:validate --latest -v devhub --tag dcac79075663f686106ba7a98d9ff8c3ae5b0fcd --json

## latest
sfdx sfpkgtools:version:latest -v devhub -n cdm-test -s

## new scratch
sfdx sfpkgtools:org:newscratch -v devhub --email --numberofdays 1 --orgalias test1 -c ./config/scratch-org-config/project-scratch-def.json --adminemail mydev123@yopmail.com --json

## project pacakge info
sfpkgtools:project:pkginfo -v devhub -v devhub