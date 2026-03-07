import React, { useEffect } from "react";
import { WOW } from "wowjs";

export default function About() {
  
  useEffect(() => {
    const wow = new WOW({ live: false });
    wow.init();
  }, []);

  return (
    <>
        {/* Page Header Start */}
        <div className="container-fluid page-header py-5 wow fadeIn" data-wow-delay="0.1s">
            <div className="container text-center py-5">
                <h1 className="display-2 text-white mb-4">About Us</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item"><a href="#">Pages</a></li>
                        <li className="breadcrumb-item text-white" aria-current="page">About Us</li>
                    </ol>
                </nav>
            </div>
        </div>
        {/* Page Header End */}


        {/* About Start */}
        {/* <div className="container-fluid py-5 about bg-light">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                        <div className="video border">
                            <button type="button" className="btn btn-play" data-bs-toggle="modal" data-src="" data-bs-target="#videoModal">
                                <span></span>
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-7 wow fadeIn" data-wow-delay="0.3s">
                        <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">About Us</h4>
                        <h1 className="text-dark mb-4 display-5">We Learn Smart Way To Build Bright Futute For Your Children</h1>
                        <p className="text-dark mb-4">Lorem Ipsum is simply dummy text of the printing and typesetting industry. the printing and typesetting industry. 
                            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer Lorem Ipsum has been the industry's standard 
                            dummy text ever since the 1500s.
                        </p>
                        <div className="row mb-4">
                            <div className="col-lg-6">
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2"></i>Games</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-primary"></i>Fun</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-secondary"></i>Nutritious Foods</h6>
                            </div>
                            <div className="col-lg-6">
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2"></i>Highly Secured</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-primary"></i>Friendly Environment</h6>
                                <h6><i className="fas fa-check-circle me-2 text-secondary"></i>Qualified Teacher</h6>
                            </div>
                        </div>
                        <a href="" className="btn btn-primary px-5 py-3 btn-border-radius">More Details</a>
                    </div>
                </div>
            </div>
        </div> */}
        {/* Modal Video */}
        {/* <div className="modal fade" id="videoModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Youtube Video</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                       
                        <div className="ratio ratio-16x9">
                            <iframe className="embed-responsive-item" src="" id="video" allowFullScreen allow="autoplay"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div> */}
        {/* About End */}
        {/* About Start */}
        <div className="container-fluid py-5 about bg-light">
            <div className="container py-5">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-5 wow fadeIn" data-wow-delay="0.1s">
                        <div className="video border">
                            <button type="button" className="btn btn-play" data-bs-toggle="modal" data-src="https://www.youtube.com/embed/DWRcNpR6Kdc" data-bs-target="#videoModal">
                                <span></span>
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-7 wow fadeIn" data-wow-delay="0.3s">
                        <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">How It Works</h4>
                        <h1 className="text-dark mb-4 display-5">We Analyze Your Gaming Style To Find Your Superpowers</h1>
                        <p className="text-dark mb-4">
                            Child Arena is more than just fun. it's a smart system that learns how you play! Our advanced <strong>"Hero Engine"</strong> works secretly in the background while you save the universe. 
                        </p>
                        <p className="text-dark mb-4">
                            As you dodge obstacles and solve puzzles, we measure your <strong>"Reflex Radar"</strong> (Reaction Time), test your <strong>"Focus Force"</strong> (Attention Span), and check your <strong>"Precision Control"</strong> (Impulsivity). This helps us build your unique Hero Profile and adjust the game to fit your brain perfectly!
                        </p>
                        <div className="row mb-4">
                            <div className="col-lg-6">
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2"></i>Reflex Testing</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-primary"></i>Focus Challenges</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-secondary"></i>Precision Metrics</h6>
                            </div>
                            <div className="col-lg-6">
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2"></i>Smart AI Tracking</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-primary"></i>Custom Difficulty</h6>
                                <h6 className="mb-3"><i className="fas fa-check-circle me-2 text-secondary"></i>Hero Scorecards</h6>
                            </div>
                        </div>
                        <a href="" className="btn btn-primary px-5 py-3 btn-border-radius">See Your Stats</a>
                    </div>
                </div>
            </div>
        </div>
        {/* Modal Video */}
        <div className="modal fade" id="videoModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content rounded-0">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Gameplay Trailer</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* 16:9 aspect ratio */}
                        <div className="ratio ratio-16x9">
                            <iframe className="embed-responsive-item" src="" id="video" allowFullScreen allow="autoplay"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* About End */}
        {/* Leaderboard Start */}
        <div className="container-fluid py-5 bg-white">
            <div className="container py-5">
                <div className="mx-auto text-center wow fadeIn" data-wow-delay="0.1s" style={{ maxWidth: "600px" }}>
                    <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">Hall of Legends</h4>
                    <h1 className="mb-5 display-3">Top Heroes of the Week</h1>
                </div>
                <div className="row g-4 justify-content-center">
                    {/* Rank 1 */}
                    <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                        <div className="bg-light rounded p-4 border border-primary text-center">
                            <div className="d-inline-block rounded-circle bg-primary text-white p-3 mb-3"><i className="fas fa-crown fa-2x"></i></div>
                            <h3 className="text-primary">SuperStar_Alex</h3>
                            <h5 className="text-muted">Level 42</h5>
                            <h1 className="display-4 text-dark mb-0">9,850 <span className="fs-6 text-muted">XP</span></h1>
                            <small className="text-primary">Master of Focus</small>
                        </div>
                    </div>
                    {/* Rank 2 */}
                    <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                        <div className="bg-light rounded p-4 border border-secondary text-center">
                            <div className="d-inline-block rounded-circle bg-secondary text-white p-3 mb-3"><i className="fas fa-medal fa-2x"></i></div>
                            <h3 className="text-secondary">Ninja_Sam</h3>
                            <h5 className="text-muted">Level 38</h5>
                            <h1 className="display-4 text-dark mb-0">8,920 <span className="fs-6 text-muted">XP</span></h1>
                            <small className="text-secondary">Speed Demon</small>
                        </div>
                    </div>
                    {/* Rank 3 */}
                    <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                        <div className="bg-light rounded p-4 border border-success text-center">
                            <div className="d-inline-block rounded-circle bg-success text-white p-3 mb-3"><i className="fas fa-trophy fa-2x"></i></div>
                            <h3 className="text-success">Pixel_Queen</h3>
                            <h5 className="text-muted">Level 35</h5>
                            <h1 className="display-4 text-dark mb-0">8,400 <span className="fs-6 text-muted">XP</span></h1>
                            <small className="text-success">Puzzle Whiz</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Leaderboard End */}

        {/* Badges Start */}
        <div className="container-fluid py-5 badge-section" style={{ background: "linear-gradient(to right, #fff5f5, #fff)" }}>
            <div className="container py-5">
                <div className="text-center mx-auto wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: "700px" }}>
                    <h1 className="display-3 mb-5">Earn Epic Badges</h1>
                    <p className="fs-5 mb-5">Complete quests to unlock these shiny rewards for your profile!</p>
                </div>
                <div className="row g-4">
                    <div className="col-6 col-md-3 text-center wow zoomIn" data-wow-delay="0.1s">
                        <img src="/src/public/img/badge-1.png" className="img-fluid mb-3" style={{ maxWidth: "100px" }} alt="Eagle Eye" /> 
                        {/* Hidden Research Meaning: Passed Attention Test */}
                        <h5 className="fw-bold">Eagle Eye</h5>
                    </div>
                    <div className="col-6 col-md-3 text-center wow zoomIn" data-wow-delay="0.3s">
                        <img src="/src/public/img/badge-2.png" className="img-fluid mb-3" style={{ maxWidth: "100px" }} alt="Flash Reflex" />
                        {/* Hidden Research Meaning: Passed Reaction Time Test */}
                        <h5 className="fw-bold">Flash Reflex</h5>
                    </div>
                    <div className="col-6 col-md-3 text-center wow zoomIn" data-wow-delay="0.5s">
                        <img src="/src/public/img/badge-3.png" className="img-fluid mb-3" style={{ maxWidth: "100px" }} alt="Zen Master" />
                        {/* Hidden Research Meaning: Low Impulsivity Score */}
                        <h5 className="fw-bold">Zen Master</h5>
                    </div>
                    <div className="col-6 col-md-3 text-center wow zoomIn" data-wow-delay="0.7s">
                        <img src="/src/public/img/badge-4.png" className="img-fluid mb-3" style={{ maxWidth: "100px" }} alt="Brainiac" />
                        {/* Hidden Research Meaning: High Working Memory */}
                        <h5 className="fw-bold">Brainiac</h5>
                    </div>
                </div>
            </div>
        </div>
        {/* Badges End */}
    </>
  );
}