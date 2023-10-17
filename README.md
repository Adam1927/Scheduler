# Backend and Frontend Template

Latest version: https://git.chalmers.se/courses/dit342/group-00-web

This template refers to itself as `group-00-web`. In your project, use your group number in place of `00`.

## Project Structure

| File        | Purpose           | What you do?  |
| ------------- | ------------- | ----- |
| `server/` | Backend server code | All your server code |
| [server/README.md](server/README.md) | Everything about the server | **READ ME** carefully! |
| `client/` | Frontend client code | All your client code |
| [client/README.md](client/README.md) | Everything about the client | **READ ME** carefully! |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Free online production deployment | Deploy your app online in production mode |
| [docs/LOCAL_DEPLOYMENT.md](docs/LOCAL_DEPLOYMENT.md) | Local production deployment | Deploy your app local in production mode |

## Requirements

The version numbers in brackets indicate the tested versions but feel free to use more recent versions.
You can also use alternative tools if you know how to configure them (e.g., Firefox instead of Chrome).

* [Git](https://git-scm.com/) (v2) => [installation instructions](https://www.atlassian.com/git/tutorials/install-git)
  * [Add your Git username and set your email](https://docs.gitlab.com/ce/gitlab-basics/start-using-git.html#add-your-git-username-and-set-your-email)
    * `git config --global user.name "YOUR_USERNAME"` => check `git config --global user.name`
    * `git config --global user.email "email@example.com"` => check `git config --global user.email`
  * > **Windows users**: We recommend to use the [Git Bash](https://www.atlassian.com/git/tutorials/git-bash) shell from your Git installation or the Bash shell from the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to run all shell commands for this project.
* [Chalmers GitLab](https://git.chalmers.se/) => Login with your **Chalmers CID** choosing "Sign in with" **Chalmers Login**. (contact [support@chalmers.se](mailto:support@chalmers.se) if you don't have one)
  * DIT342 course group: https://git.chalmers.se/courses/dit342
  * [Setup SSH key with Gitlab](https://docs.gitlab.com/ee/ssh/)
    * Create an SSH key pair `ssh-keygen -t ed25519 -C "email@example.com"` (skip if you already have one)
    * Add your public SSH key to your Gitlab profile under https://git.chalmers.se/profile/keys
    * Make sure the email you use to commit is registered under https://git.chalmers.se/profile/emails
  * Checkout the [Backend-Frontend](https://git.chalmers.se/courses/dit342/group-00-web) template `git clone git@git.chalmers.se:courses/dit342/group-00-web.git`
* [Server Requirements](./server/README.md#Requirements)
* [Client Requirements](./client/README.md#Requirements)

## Getting started

```bash
# Clone repository
git clone git@git.chalmers.se:courses/dit342/group-00-web.git

# Change into the directory
cd group-00-web

# Setup backend
cd server && npm install
npm run dev

# Setup frontend
cd client && npm install
npm run serve
```

> Check out the detailed instructions for [backend](./server/README.md) and [frontend](./client/README.md).

## Visual Studio Code (VSCode)

Open the `server` and `client` in separate VSCode workspaces or open the combined [backend-frontend.code-workspace](./backend-frontend.code-workspace). Otherwise, workspace-specific settings don't work properly.

## System Definition (MS0)

### Purpose

This web application will allow users to get the most optimal time for a meeting by incorporating teams, events, and polls. The system evaluates the joint availability of the team members, by allowing them to select their free time slots each. The system then calculates the five best time slots for the meeting by the manager’s command. This will help make organizing and planning easier and more convenient for the users. The goal is to give the manager a clear overview of everyone’s availability and help in making sure that no one will miss out on important meetings because of unclear time management and communication.


### Pages

* Login/register page is for all users to enter their account.
* Main page is where the user can view the teams they are managing and teams they are a member of. They also have the ability to add teams here. There is also a sidebar which gives users the ability to edit their profiles or log out from their account.
* Team Details page includes info about team members: names. If the user is the manager of that team, they have the functionality to add users, edit the team info or delete the team. The manager also has the option of adding events for the team.
* Event Details page which includes the calendar to choose the free time slots for that event and submit. If the user is the manager of that team, they have the functionality to get optimal time for the event or delete the event altogether.
* Add Event page allows for the creation of events, only accessible for the manager of the given team.
* Add Team page allows for the creation of teams which includes adding members to that team.
* Edit Profile page which allows users to change their names and usernames.
* Optimal Time page which shows the manager the best times available for a specific event and gives them the option to choose one.
* Selected Slot page replaces the Event Details page once the manager has chosen a specific time for that event.



### Entity-Relationship (ER) Diagram

![ER Diagram](./images/er_diagram.jpg)

## Teaser (MS3)

![Teaser](./images/teaser.png)
