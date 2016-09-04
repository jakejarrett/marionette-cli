# Support for per-project config
* ~~Ideally via something like .mnrc~~
* CLI Pass through --config "file"
    * Support relative and absolute paths
    * Would supersede all other config files
    * Can be passed through with other options (EG/ mt set es6 --config "file")
* "dir" option for where the base directory is located (Eg/ mt -g view NewFolderName which would be ~/dev/project/some/deeper/folder/NewFolderName/)

# Support for custom boilerplate
* Configured inside of .mnrc

# Add in application debugging
* Ability to see applications state at any given time
  * Would probably be achieved via [chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface)

* Ability to query/interact application inside of cli
  * Similar to stepping through code in chrome. 
