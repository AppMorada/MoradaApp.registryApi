'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">MoradaApp.Api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AdaptersModule.html" data-type="entity-link" >AdaptersModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FirestoreModule.html" data-type="entity-link" >FirestoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-FirestoreModule-53e0985befd908704d09fb8e70110035daadc7ab8c5d887d1c2db08ef994811c143882ab21a6f2120696bd212fbfdfe6ca4552959ef86948ae93660a0bbfd070"' : 'data-bs-target="#xs-injectables-links-module-FirestoreModule-53e0985befd908704d09fb8e70110035daadc7ab8c5d887d1c2db08ef994811c143882ab21a6f2120696bd212fbfdfe6ca4552959ef86948ae93660a0bbfd070"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FirestoreModule-53e0985befd908704d09fb8e70110035daadc7ab8c5d887d1c2db08ef994811c143882ab21a6f2120696bd212fbfdfe6ca4552959ef86948ae93660a0bbfd070"' :
                                        'id="xs-injectables-links-module-FirestoreModule-53e0985befd908704d09fb8e70110035daadc7ab8c5d887d1c2db08ef994811c143882ab21a6f2120696bd212fbfdfe6ca4552959ef86948ae93660a0bbfd070"' }>
                                        <li class="link">
                                            <a href="injectables/CollectionsRefService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CollectionsRefService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FirestoreService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FirestoreService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GatewayModule.html" data-type="entity-link" >GatewayModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HttpModule.html" data-type="entity-link" >HttpModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-HttpModule-f09857d1ab4d132e7d10f3c8902d42743743ffa2b97504364437fedbf7ef023b4f6d2a17bd9a4a3234a64a3794703d819407bb705822628e6cacf05a3b24ce5e"' : 'data-bs-target="#xs-controllers-links-module-HttpModule-f09857d1ab4d132e7d10f3c8902d42743743ffa2b97504364437fedbf7ef023b4f6d2a17bd9a4a3234a64a3794703d819407bb705822628e6cacf05a3b24ce5e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HttpModule-f09857d1ab4d132e7d10f3c8902d42743743ffa2b97504364437fedbf7ef023b4f6d2a17bd9a4a3234a64a3794703d819407bb705822628e6cacf05a3b24ce5e"' :
                                            'id="xs-controllers-links-module-HttpModule-f09857d1ab4d132e7d10f3c8902d42743743ffa2b97504364437fedbf7ef023b4f6d2a17bd9a4a3234a64a3794703d819407bb705822628e6cacf05a3b24ce5e"' }>
                                            <li class="link">
                                                <a href="controllers/AdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/CondominiumController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CondominiumController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/SuperAdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SuperAdminController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HttpModule-f09857d1ab4d132e7d10f3c8902d42743743ffa2b97504364437fedbf7ef023b4f6d2a17bd9a4a3234a64a3794703d819407bb705822628e6cacf05a3b24ce5e"' : 'data-bs-target="#xs-injectables-links-module-HttpModule-f09857d1ab4d132e7d10f3c8902d42743743ffa2b97504364437fedbf7ef023b4f6d2a17bd9a4a3234a64a3794703d819407bb705822628e6cacf05a3b24ce5e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HttpModule-f09857d1ab4d132e7d10f3c8902d42743743ffa2b97504364437fedbf7ef023b4f6d2a17bd9a4a3234a64a3794703d819407bb705822628e6cacf05a3b24ce5e"' :
                                        'id="xs-injectables-links-module-HttpModule-f09857d1ab4d132e7d10f3c8902d42743743ffa2b97504364437fedbf7ef023b4f6d2a17bd9a4a3234a64a3794703d819407bb705822628e6cacf05a3b24ce5e"' }>
                                        <li class="link">
                                            <a href="injectables/CreateCondominiumService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateCondominiumService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CreateTokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateTokenService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CreateUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CreateUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeleteUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeleteUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GenInviteService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GenInviteService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GenTFAService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GenTFAService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GetCondominiumRelUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GetCondominiumRelUserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PrismaModule.html" data-type="entity-link" >PrismaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PrismaModule-61445c4f4b488f43afa6831fda6c4fcf4ec04bb85b1a7b36998eb8dad90c6a3d6ccf8efdf284fac6c28e55c1549328b22d1e1e5bd5e7fd0828a0b7b8e3b32f4d"' : 'data-bs-target="#xs-injectables-links-module-PrismaModule-61445c4f4b488f43afa6831fda6c4fcf4ec04bb85b1a7b36998eb8dad90c6a3d6ccf8efdf284fac6c28e55c1549328b22d1e1e5bd5e7fd0828a0b7b8e3b32f4d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PrismaModule-61445c4f4b488f43afa6831fda6c4fcf4ec04bb85b1a7b36998eb8dad90c6a3d6ccf8efdf284fac6c28e55c1549328b22d1e1e5bd5e7fd0828a0b7b8e3b32f4d"' :
                                        'id="xs-injectables-links-module-PrismaModule-61445c4f4b488f43afa6831fda6c4fcf4ec04bb85b1a7b36998eb8dad90c6a3d6ccf8efdf284fac6c28e55c1549328b22d1e1e5bd5e7fd0828a0b7b8e3b32f4d"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AdapterError.html" data-type="entity-link" >AdapterError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdapterErrorFilter.html" data-type="entity-link" >AdapterErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApartmentNumber.html" data-type="entity-link" >ApartmentNumber</a>
                            </li>
                            <li class="link">
                                <a href="classes/Auth.html" data-type="entity-link" >Auth</a>
                            </li>
                            <li class="link">
                                <a href="classes/BcryptAdapter.html" data-type="entity-link" >BcryptAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Block.html" data-type="entity-link" >Block</a>
                            </li>
                            <li class="link">
                                <a href="classes/CEP.html" data-type="entity-link" >CEP</a>
                            </li>
                            <li class="link">
                                <a href="classes/CepGateway.html" data-type="entity-link" >CepGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/CepGatewaySpy.html" data-type="entity-link" >CepGatewaySpy</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClassValidatorErrorFilter.html" data-type="entity-link" >ClassValidatorErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CNPJ.html" data-type="entity-link" >CNPJ</a>
                            </li>
                            <li class="link">
                                <a href="classes/Code.html" data-type="entity-link" >Code</a>
                            </li>
                            <li class="link">
                                <a href="classes/Condominium.html" data-type="entity-link" >Condominium</a>
                            </li>
                            <li class="link">
                                <a href="classes/CondominiumFirestoreMapper.html" data-type="entity-link" >CondominiumFirestoreMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/CondominiumMapper.html" data-type="entity-link" >CondominiumMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/CondominiumPrismaMapper.html" data-type="entity-link" >CondominiumPrismaMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/CondominiumRelUser.html" data-type="entity-link" >CondominiumRelUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/CondominiumRelUserFirestoreMapper.html" data-type="entity-link" >CondominiumRelUserFirestoreMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/CondominiumRelUserMapper.html" data-type="entity-link" >CondominiumRelUserMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/CondominiumRelUserPrismaMapper.html" data-type="entity-link" >CondominiumRelUserPrismaMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/CondominiumRepo.html" data-type="entity-link" >CondominiumRepo</a>
                            </li>
                            <li class="link">
                                <a href="classes/CookieAdapter.html" data-type="entity-link" >CookieAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CookieParserAdapter.html" data-type="entity-link" >CookieParserAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CPF.html" data-type="entity-link" >CPF</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCondominiumDTO.html" data-type="entity-link" >CreateCondominiumDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDTO.html" data-type="entity-link" >CreateUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/CryptAdapter.html" data-type="entity-link" >CryptAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/CryptSpy.html" data-type="entity-link" >CryptSpy</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseCustomError.html" data-type="entity-link" >DatabaseCustomError</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseCustomErrorFilter.html" data-type="entity-link" >DatabaseCustomErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/DateFormats.html" data-type="entity-link" >DateFormats</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserDTO.html" data-type="entity-link" >DeleteUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/EchoguardAdapter.html" data-type="entity-link" >EchoguardAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Email.html" data-type="entity-link" >Email</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailAdapter.html" data-type="entity-link" >EmailAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailSpy.html" data-type="entity-link" >EmailSpy</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntitieError.html" data-type="entity-link" >EntitieError</a>
                            </li>
                            <li class="link">
                                <a href="classes/EntitieErrorFilter.html" data-type="entity-link" >EntitieErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Entity.html" data-type="entity-link" >Entity</a>
                            </li>
                            <li class="link">
                                <a href="classes/FetchAdapter.html" data-type="entity-link" >FetchAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirebaseLoggerAdapter.html" data-type="entity-link" >FirebaseLoggerAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirestoreGetCondominiumDTO.html" data-type="entity-link" >FirestoreGetCondominiumDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirestoreGetCondominiumRelUserDTO.html" data-type="entity-link" >FirestoreGetCondominiumRelUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirestoreGetInviteDTO.html" data-type="entity-link" >FirestoreGetInviteDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/FirestoreGetUserDTO.html" data-type="entity-link" >FirestoreGetUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/GatewayErrorFilter.html" data-type="entity-link" >GatewayErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/GatewayErrors.html" data-type="entity-link" >GatewayErrors</a>
                            </li>
                            <li class="link">
                                <a href="classes/GenericErrorFilter.html" data-type="entity-link" >GenericErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/GuardErrorFilter.html" data-type="entity-link" >GuardErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/GuardErrors.html" data-type="entity-link" >GuardErrors</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpAdapter.html" data-type="entity-link" >HttpAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Index.html" data-type="entity-link" >Index</a>
                            </li>
                            <li class="link">
                                <a href="classes/InMemoryCondominium.html" data-type="entity-link" >InMemoryCondominium</a>
                            </li>
                            <li class="link">
                                <a href="classes/InMemoryContainer.html" data-type="entity-link" >InMemoryContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/InMemoryError.html" data-type="entity-link" >InMemoryError</a>
                            </li>
                            <li class="link">
                                <a href="classes/InMemoryInvite.html" data-type="entity-link" >InMemoryInvite</a>
                            </li>
                            <li class="link">
                                <a href="classes/InMemoryOTP.html" data-type="entity-link" >InMemoryOTP</a>
                            </li>
                            <li class="link">
                                <a href="classes/InMemoryUser.html" data-type="entity-link" >InMemoryUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/Invite.html" data-type="entity-link" >Invite</a>
                            </li>
                            <li class="link">
                                <a href="classes/InviteFirestoreMapper.html" data-type="entity-link" >InviteFirestoreMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/InviteMapper.html" data-type="entity-link" >InviteMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvitePrismaMapper.html" data-type="entity-link" >InvitePrismaMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/InviteRepo.html" data-type="entity-link" >InviteRepo</a>
                            </li>
                            <li class="link">
                                <a href="classes/InviteUserDTO.html" data-type="entity-link" >InviteUserDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/IService.html" data-type="entity-link" >IService</a>
                            </li>
                            <li class="link">
                                <a href="classes/LaunchTFADTO.html" data-type="entity-link" >LaunchTFADTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Level.html" data-type="entity-link" >Level</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoggerAdapter.html" data-type="entity-link" >LoggerAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDTO.html" data-type="entity-link" >LoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/Name.html" data-type="entity-link" >Name</a>
                            </li>
                            <li class="link">
                                <a href="classes/NodemailerAdapter.html" data-type="entity-link" >NodemailerAdapter</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotFoundFilter.html" data-type="entity-link" >NotFoundFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/Num.html" data-type="entity-link" >Num</a>
                            </li>
                            <li class="link">
                                <a href="classes/OTP.html" data-type="entity-link" >OTP</a>
                            </li>
                            <li class="link">
                                <a href="classes/OTPMapper.html" data-type="entity-link" >OTPMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/OTPRepo.html" data-type="entity-link" >OTPRepo</a>
                            </li>
                            <li class="link">
                                <a href="classes/Password.html" data-type="entity-link" >Password</a>
                            </li>
                            <li class="link">
                                <a href="classes/PhoneNumber.html" data-type="entity-link" >PhoneNumber</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrismaErrorFilter.html" data-type="entity-link" >PrismaErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegistryAPIBootstrap.html" data-type="entity-link" >RegistryAPIBootstrap</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServiceErrorFilter.html" data-type="entity-link" >ServiceErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ServiceErrors.html" data-type="entity-link" >ServiceErrors</a>
                            </li>
                            <li class="link">
                                <a href="classes/ThrottlerErrorFilter.html" data-type="entity-link" >ThrottlerErrorFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserFirestoreMapper.html" data-type="entity-link" >UserFirestoreMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserMapper.html" data-type="entity-link" >UserMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserPrismaMapper.html" data-type="entity-link" >UserPrismaMapper</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserRepo.html" data-type="entity-link" >UserRepo</a>
                            </li>
                            <li class="link">
                                <a href="classes/UUID.html" data-type="entity-link" >UUID</a>
                            </li>
                            <li class="link">
                                <a href="classes/UUIDGroup.html" data-type="entity-link" >UUIDGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValueObject.html" data-type="entity-link" >ValueObject</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/CondominiumPrismaRepo.html" data-type="entity-link" >CondominiumPrismaRepo</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CondominiumsFirestore.html" data-type="entity-link" >CondominiumsFirestore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CreateCondominiumService.html" data-type="entity-link" >CreateCondominiumService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CreateTokenService.html" data-type="entity-link" >CreateTokenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CreateUserService.html" data-type="entity-link" >CreateUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeleteUserService.html" data-type="entity-link" >DeleteUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GenInviteService.html" data-type="entity-link" >GenInviteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GenTFAService.html" data-type="entity-link" >GenTFAService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GetCondominiumRelUserService.html" data-type="entity-link" >GetCondominiumRelUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InviteFirestore.html" data-type="entity-link" >InviteFirestore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InvitePrismaRepo.html" data-type="entity-link" >InvitePrismaRepo</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LogInterceptor.html" data-type="entity-link" >LogInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserPrismaRepo.html" data-type="entity-link" >UserPrismaRepo</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersFirestore.html" data-type="entity-link" >UsersFirestore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ViacepGateway.html" data-type="entity-link" >ViacepGateway</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AdminJwt.html" data-type="entity-link" >AdminJwt</a>
                            </li>
                            <li class="link">
                                <a href="guards/CheckPasswordGuard.html" data-type="entity-link" >CheckPasswordGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/CheckTFACodeGuard.html" data-type="entity-link" >CheckTFACodeGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/HmacInviteGuard.html" data-type="entity-link" >HmacInviteGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/JwtGuard.html" data-type="entity-link" >JwtGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RefreshTokenGuard.html" data-type="entity-link" >RefreshTokenGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/SuperAdminJwt.html" data-type="entity-link" >SuperAdminJwt</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/create.html" data-type="entity-link" >create</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/create-1.html" data-type="entity-link" >create</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/create-2.html" data-type="entity-link" >create</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/find.html" data-type="entity-link" >find</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/getAllCondominiumRelation.html" data-type="entity-link" >getAllCondominiumRelation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/getCondominiumRelation.html" data-type="entity-link" >getCondominiumRelation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAccessTokenBody.html" data-type="entity-link" >IAccessTokenBody</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBodyProps.html" data-type="entity-link" >IBodyProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICheckCep.html" data-type="entity-link" >ICheckCep</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IClass.html" data-type="entity-link" >IClass</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICondominiumRelUserInObject.html" data-type="entity-link" >ICondominiumRelUserInObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICondominiumRelUserProps.html" data-type="entity-link" >ICondominiumRelUserProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConvertToObject.html" data-type="entity-link" >IConvertToObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConvertToObject-1.html" data-type="entity-link" >IConvertToObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConvertToObject-2.html" data-type="entity-link" >IConvertToObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICreateOTPInput.html" data-type="entity-link" >ICreateOTPInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICryptCompare.html" data-type="entity-link" >ICryptCompare</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ICryptHmac.html" data-type="entity-link" >ICryptHmac</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDeleteOTPInput.html" data-type="entity-link" >IDeleteOTPInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFindOTPInput.html" data-type="entity-link" >IFindOTPInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFirestoreErrors.html" data-type="entity-link" >IFirestoreErrors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGatewayError.html" data-type="entity-link" >IGatewayError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGenerateInviteKeyProps.html" data-type="entity-link" >IGenerateInviteKeyProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IHttpClientCall.html" data-type="entity-link" >IHttpClientCall</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IHttpClientCallReturn.html" data-type="entity-link" >IHttpClientCallReturn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIncomingFirestoreCondominiumData.html" data-type="entity-link" >IIncomingFirestoreCondominiumData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIncomingFirestoreCondominiumRelUserData.html" data-type="entity-link" >IIncomingFirestoreCondominiumRelUserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIncomingFirestoreInviteData.html" data-type="entity-link" >IIncomingFirestoreInviteData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIncomingFirestoreUserData.html" data-type="entity-link" >IIncomingFirestoreUserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IIndexProps.html" data-type="entity-link" >IIndexProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInMemoryContainerProps.html" data-type="entity-link" >IInMemoryContainerProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInMemoryUserContainer.html" data-type="entity-link" >IInMemoryUserContainer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInputCondominiumRelUser.html" data-type="entity-link" >IInputCondominiumRelUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IInputPropsInvite.html" data-type="entity-link" >IInputPropsInvite</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ILoggerDefaultProps.html" data-type="entity-link" >ILoggerDefaultProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOTPInObject.html" data-type="entity-link" >IOTPInObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IOTPProps.html" data-type="entity-link" >IOTPProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPrismaError.html" data-type="entity-link" >IPrismaError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-1.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-2.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-3.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-4.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-5.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-6.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-7.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-8.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-9.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-10.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-11.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-12.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-13.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-14.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-15.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IProps-16.html" data-type="entity-link" >IProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPropsCondominium.html" data-type="entity-link" >IPropsCondominium</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPropsUser.html" data-type="entity-link" >IPropsUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IRefreshTokenBody.html" data-type="entity-link" >IRefreshTokenBody</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISendMailContent.html" data-type="entity-link" >ISendMailContent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IServiceErrors.html" data-type="entity-link" >IServiceErrors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ISuccess.html" data-type="entity-link" >ISuccess</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUntrackableErrors.html" data-type="entity-link" >IUntrackableErrors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserDataCore.html" data-type="entity-link" >IUserDataCore</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserInObject.html" data-type="entity-link" >IUserInObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IValidate.html" data-type="entity-link" >IValidate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IValidateSignedCookie.html" data-type="entity-link" >IValidateSignedCookie</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/remove.html" data-type="entity-link" >remove</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/remove-1.html" data-type="entity-link" >remove</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/safelyFind.html" data-type="entity-link" >safelyFind</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/safeSearch.html" data-type="entity-link" >safeSearch</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/safeSearch-1.html" data-type="entity-link" >safeSearch</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/search.html" data-type="entity-link" >search</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/search-1.html" data-type="entity-link" >search</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/transferToUserResources.html" data-type="entity-link" >transferToUserResources</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise-inverted.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});