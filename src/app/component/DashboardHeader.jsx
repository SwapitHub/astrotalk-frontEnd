import React from 'react'

const DashboardHeader = () => {
  return (
    <div className="page-main-header">
            <div className="main-header-right ">
                <div className="main-header-left d-lg-none w-auto">
                    <div className="logo-wrapper">
                        <a href="https://api.rocksama.com/controlpanel/dashboard">
                            <img className="blur-up lazyloaded d-block d-lg-none" src=" https://assets.rocksama.com/public/storage/images/1716284040_SAMA.png" alt="Logo" />
                        </a>
                    </div>
                </div>
                <div className="mobile-sidebar w-auto">
                    <div className="media-body text-end switch-sm">
                        <label className="switch"><a href="javascript:void(0)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-align-left" id="sidebar-toggle"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg></a></label>
                    </div>
                </div>
                <div className="nav-right col">
                    <ul className="nav-menus">

                        <li><a className="text-dark" href="#!" onclick="javascript:toggleFullScreen()"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-maximize-2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg></a></li>

                        <li className="onhover-dropdown"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg><span className="badge badge-pill badge-primary pull-right notification-badge">4</span><span className="dot"></span>
                            <ul className="notification-dropdown onhover-show-div p-0">
                                <li>Notification <span className="badge badge-pill badge-primary pull-right" id="notification-badge">4</span></li>
                                                                <li>

                                    <div className="media">
                                        <div className="media-body">
                                            <h6 className="mt-0 txt-success">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-message-square download-color font-success"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                </span>
                                                <a href="#" className="txt-success">Task Completed</a>
                                                <small>17 Feb 25 , 08:05:36</small>
                                            </h6>

                                                        <a href="#"> <p className="mb-0">Gemstone sheet has been generated.</p></a>
                                        </div>
                                    </div>

                                </li>
                                                                <li>

                                    <div className="media">
                                        <div className="media-body">
                                            <h6 className="mt-0 txt-success">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-message-square download-color font-success"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                </span>
                                                <a href="#" className="txt-success">Task Completed</a> 
                                                <small>17 Feb 25 , 07:36:03</small>
                                            </h6>

                                                        <a href="#"> <p className="mb-0">lab grown  diamomd sheet has been generated.</p></a>
                                        </div>
                                    </div>

                                </li>
                                                                <li>

                                    <div className="media">
                                        <div className="media-body">
                                            <h6 className="mt-0 txt-success">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-message-square download-color font-success"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                </span>
                                                <a href="#" className="txt-success">Task Completed</a> 
                                                <small>17 Feb 25 , 07:26:45</small>
                                            </h6>

                                                        <a href="#"> <p className="mb-0">Natural diamomd sheet has been generated.</p></a>
                                        </div>
                                    </div>

                                </li>
                                                                <li>

                                    <div className="media">
                                        <div className="media-body">
                                            <h6 className="mt-0 txt-success">
                                                <span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-message-square download-color font-success"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                                </span>
                                                <a href="#" className="txt-success">Sama price export completed</a>
                                                <small>17 Feb 25 , 05:17:41</small>
                                            </h6>

                                                        <a href="#"> <p className="mb-0">Sama price export has been completed.</p></a>
                                        </div>
                                    </div>

                                </li>
                                                                
                                
                            </ul>
                        </li>
                        <li className="onhover-dropdown">
                            <div className="media align-items-center">
                                                                    <img className="align-self-center pull-right img-50 blur-up lazyloaded" src=" https://assets.rocksama.com/public/storage/images/dashboard/1744778685_favicon.png" alt="admin" />
                                                                <div className="dotted-animation"><span className="animate-circle"></span><span className="main-circle"></span>
                                </div>
                            </div>
                            <ul className="profile-dropdown onhover-show-div p-20">
                                <li><a href="https://api.rocksama.com/controlpanel/profile"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>Profile</a>
                                </li>
                                <li><a href="javascript:void(0)"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-settings"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>Settings</a></li>
                                
                                <li><a href="javascript:void(0)" onclick="logout('https://api.rocksama.com/controlpanel/logout')"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>Logout</a></li>


                            </ul>
                        </li>
                    </ul>
                    <div className="d-lg-none mobile-toggle pull-right"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></div>
                </div>
            </div>
        </div>
  )
}

export default DashboardHeader