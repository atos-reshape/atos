### Clone this repository
This project uses git submodules such that development on multiple repositories becomes easier. Please note that
running commands below in this repo, when changes are present in the submodules might **remove / reset** your
changes in the submodule. To prevent this you can use --rebase when using `git submodule update ...` which
will rebase on top of incoming changes. For more information see
[git docs](https://git-scm.com/book/en/v2/Git-Tools-Submodules).

To clone this repository make sure to include the --recursive command:
```
git clone --recursive git@github.com:atos-reshape/atos.git
```

To update submodules you can use:
```
git submodule update --init --remote
```

To pull updates and commits or checkout branches to this repo use:
```
git pull --recurse-submodules
```

To add a new submodule use:
```
git submodule add [clone-url] [service-name]
```