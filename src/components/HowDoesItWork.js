import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Link } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

function getSteps() {
  return [
    "Upload file",
    "Read / listen to content",
    "Resume reading / listening",
    "Sign up",
  ];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `When you upload a file, Resumr stores a copy in your browser &
        generates a unique link.`;
    case 1:
      return "Every time you read, listen or watch, Resumr stores the progress in your browser.";
    case 2:
      return `Every time you open the link again, Resumr continues where you last left off.`;
    case 3:
      return `When you sign up, we sync this content to your other devices so you can continue there too.`;
    default:
      return "Unknown step";
  }
}

export default function HowDoesItWork({ handleHide }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = getSteps();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(index)}</Typography>
              <div className={classes.actionsContainer}>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    className={classes.button}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      <Paper square elevation={0} className={classes.resetContainer}>
        {activeStep === steps.length && (
          <>
            <Typography>
              That's all there is to it! Click on the help icon any time you
              want to see this again.
            </Typography>
            <Button onClick={handleHide} className={classes.button}>
              Hide
            </Button>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </>
        )}
        <Button variant="outlined" component={Link} to="/help">
          FAQs & More
        </Button>
      </Paper>
    </div>
  );
}
