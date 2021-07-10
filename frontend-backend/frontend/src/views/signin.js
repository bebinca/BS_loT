import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Component } from "react";
import store from "../store";
import "../store";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/bebinca/">
        TYYYYY
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(img.jfif)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignInSide() {
  const classes = useStyles();
  const handleChangeName = (event) => {
    store.handleChange.SetUserName(event.target.value);
  };
  const handleChangePwd = (event) => {
    store.handleChange.SetUserPwd(event.target.value);
  };
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleClickNoti = (mess) => {
    setOpen(true);
    setMessage(mess);
  };
  const handleCloseNoti = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  async function handleClick() {
    let username = store.getData.GetUserName();
    let pwd = store.getData.GetPassWord();
    let content = {
      username: username,
      password: pwd,
    };
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json["error"] == null) {
          // 成功登录
          store.handleChange.SetUserName(json["name"]);
          store.handleChange.SetUserId(json["user_id"]);
          store.handleChange.SetLogin(1);
          store.refreshComponent("HeadCard3");
        } else {
          handleClickNoti(json["error"]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  async function handleSignup() {
    store.handleChange.SetSignup(1);
  }
  return (
    <div>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form
              className={classes.form}
              noValidate
              method="post"
              action="/login"
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user_name"
                label="User Name / Email Address"
                name="user_name"
                autoFocus
                onChange={handleChangeName}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChangePwd}
              />
              <Button
                // type="submit"
                onClick={handleClick}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Button color="primary" onClick={handleSignup}>
                    Don't have an account? Sign Up
                  </Button>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseNoti}
        message={message}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseNoti}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

function SignUpSide() {
  const classes = useStyles();
  const handleChangeName = (event) => {
    store.handleChange.SetUserName(event.target.value);
  };
  const handleChangePwd = (event) => {
    store.handleChange.SetUserPwd(event.target.value);
  };
  const handleChangeEmail = (event) => {
    store.handleChange.SetEmail(event.target.value);
  };
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const handleClickNoti = (mess) => {
    setOpen(true);
    setMessage(mess);
  };
  const handleCloseNoti = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  async function handleClick() {
    let username = store.getData.GetUserName();
    let pwd = store.getData.GetPassWord();
    let email = store.getData.GetEmail();
    let content = {
      username: username,
      email: email,
      password: pwd,
    };
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(content),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json["error"] == null) {
          // 成功注册
          store.handleChange.SetSignup(0);
        } else {
          handleClickNoti(json["error"]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  async function handleSignup() {
    store.handleChange.SetSignup(0);
  }
  return (
    <div>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form
              className={classes.form}
              noValidate
              method="post"
              action="/login"
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user_name"
                label="User Name"
                name="user_name"
                autoFocus
                onChange={handleChangeName}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoFocus
                onChange={handleChangeEmail}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={handleChangePwd}
              />
              <Button
                // type="submit"
                onClick={handleClick}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Button color="primary" onClick={handleSignup}>
                    Already have an account? Sign In
                  </Button>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseNoti}
        message={message}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseNoti}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
}

class SignIn extends Component {
  componentDidMount() {
    store.registerComponent("SignIn", this);
  }
  componentWillUnmount() {
    store.unregisterComponent("SignIn", this);
  }
  render() {
    if (store.getData.GetSignup() === 0) {
      return <SignInSide />;
    }
    if (store.getData.GetSignup() === 1) {
      return <SignUpSide />;
    }
  }
}

export default SignIn;
