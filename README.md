# wt-ws19
## Web Technology WS 2019

### General info
[Class website](http://kti.tugraz.at/staff/vsabol/courses/wt/)

### Git info
#### Flow / Branches
Use the [feature branch workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow).   
Example:
```
-master
--feature1
--feature2
```

The master branch of a task should be buildable and runnable at most points, out of
the master branch a release and/or submission branch can be checked out.

#### Pull requests
Open a pull request with your branch to be merged into master. The pull request should be reviewed by at least one other person of the team before it is merged into master. Tag your pull request `needs review` when it is ready to be reviewed and merged. You may also open a pull request that is still in progress, by prepending its title with "WIP: ".

#### Commit message conventions
Please use the present tense or imparative mood.  
Example: `Update function signature`  
Further reading: [1](http://chris.beams.io/posts/git-commit/#imperative), [2](https://wiki.openstack.org/wiki/GitCommitMessages)
