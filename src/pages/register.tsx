import AuthComponent from "../components/AuthComponent";
import RegistrationForm from "../components/RegistrationForm";

function Register() {
  return (
    <AuthComponent
      className={"bg-registerImageLight dark:bg-registerImageDark"}
    >
      <RegistrationForm />
    </AuthComponent>
  );
}

export default Register;
