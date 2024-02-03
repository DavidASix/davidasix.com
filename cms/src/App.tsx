import { useCallback, useState } from "react";
import { useDataEnhancementPlugin } from "@firecms/data_enhancement";
import { User as FirebaseUser } from "firebase/auth";
import {
  Authenticator,
  FirebaseCMSApp,
  FirebaseLoginView,
  FirebaseLoginViewProps,
} from "firecms";
import { firebaseConfig } from "./firebase-config.ts";

import { formulasCollection } from "./collections/excel-formulas.tsx";
import { blogCollection } from "./collections/blog.tsx";
import { socialMediaCollection } from "./collections/social-media.tsx";
import { mobileAppCollection } from "./collections/mobile-apps.tsx";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

import logo from "./images/logo.png";

function LoginView(props: FirebaseLoginViewProps) {
  return (
    <FirebaseLoginView
      {...props}
      noUserComponent={<>Login failed, please try again.</>}
      disableSignupScreen
    />
  );
}

export default function App() {
  const [oldUid, setOldUid] = useState(null);
  const dataEnhancementPlugin = useDataEnhancementPlugin({
    // Paths that will be enhanced
    getConfigForPath: ({ path }) => {
      return true;
    },
  });

  const authenticator: Authenticator<FirebaseUser> = useCallback(
    async ({ user, authController }) => {
      return true;
    },
    []
  );

  return (
    <FirebaseCMSApp
      name={"DavidASix"}
      plugins={[]}
      allowSkipLogin={false}
      authentication={authenticator}
      collections={[formulasCollection, blogCollection, mobileAppCollection]}
      signInOptions={["password"]}
      LoginView={LoginView}
      logo={logo}
      primaryColor={"#db031a"}
      secondaryColor={"#780202"}
      firebaseConfig={firebaseConfig}
    />
  );
}
