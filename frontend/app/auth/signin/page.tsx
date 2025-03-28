
  import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';

import { providerMap } from '../../../auth';

import serverSignIn from './actions';



export default function SignIn() {

  return (
    <SignInPage
      providers={providerMap}
      signIn={serverSignIn}
    />
  );
}