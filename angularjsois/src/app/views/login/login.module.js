

'use strict';

import {loginControllerFunc} from "./login.controller";
import {loginServiceFunc} from "./login.service";

export function LoginModule(Angular) {
    const loginModule = Angular.module('login', []);
    loginControllerFunc(loginModule);
    loginServiceFunc(loginModule);
}

/*LoginModule(angular);*/
