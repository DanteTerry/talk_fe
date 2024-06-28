import AuthComponent from "../components/AuthComponent";
import RegistrationForm from "../components/RegistrationForm";

function register() {
  return (
    <AuthComponent
      className={"bg-registerImageLight dark:bg-registerImageDark"}
    >
      <RegistrationForm />
    </AuthComponent>
  );
}

export default register;
