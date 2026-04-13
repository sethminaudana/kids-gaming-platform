import React from "react";
import { Link } from "react-router-dom";

export default function Games() {
  return (
    <>
        {/* --- Page Header Start --- */}
        {/* This creates the nice blue banner at the top of the page */}
        <div className="container-fluid page-header py-5 mb-5" >
            <div className="container text-center py-5">
                <h1 className="display-2 text-white mb-4"> Game Hub</h1>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item"><Link to="/dashboard" className="text-white">Dashboard</Link></li>
                        <li className="breadcrumb-item text-white" aria-current="page">Games</li>
                    </ol>
                </nav>
            </div>
        </div>
        {/* --- Page Header End --- */}

        {/* --- Games Grid Start --- */}
        <div className="container-fluid service py-5">
            <div className="container py-5">
                
                {/* Section Title */}
                <div className="mx-auto text-center mb-5" style={{ maxWidth: "700px" }}>
                    <h4 className="text-primary mb-4 border-bottom border-primary border-2 d-inline-block p-2 title-border-radius">
                        Our Interactive Games
                    </h4>
                    <h1 className="mb-5 display-4">Train Your Brain While Having Fun</h1>
                </div>

                {/* Game Cards Row */}
                <div className="row g-5 justify-content-center">
                    
                    {/* Game 1: Memory Game */}
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="text-center border-primary border bg-white service-item h-100">
                            <div className="service-content d-flex align-items-center justify-content-center p-4 h-100">
                                <div className="service-content-inner">
                                    <div className="p-4"><i className="fas fa-brain fa-6x text-primary"></i></div>
                                    <h4 className="h4">Memory Game</h4>
                                    <p className="my-3 text-muted">
                                        Test and improve your short-term memory by finding matching pairs of cards before time runs out!
                                    </p>
                                    <Link to="/memorygame" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">
                                        Play Now <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game 2: No-Go Game */}
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="text-center border-primary border bg-white service-item h-100">
                            <div className="service-content d-flex align-items-center justify-content-center p-4 h-100">
                                <div className="service-content-inner">
                                    <div className="p-4"><i className="fas fa-hand-paper fa-6x text-primary"></i></div>
                                    <h4 className="h4">No-Go Game</h4>
                                    <p className="my-3 text-muted">
                                        Practice impulse control and rapid decision making. Click on green, but stop when you see red!
                                    </p>
                                    <Link to="/nogo-game" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">
                                        Play Now <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game 3: Jigsaw Puzzle */}
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="text-center border-primary border bg-white service-item h-100">
                            <div className="service-content d-flex align-items-center justify-content-center p-4 h-100">
                                <div className="service-content-inner">
                                    <div className="p-4"><i className="fas fa-puzzle-piece fa-6x text-primary"></i></div>
                                    <h4 className="h4">Jigsaw Puzzle</h4>
                                    <p className="my-3 text-muted">
                                        Enhance spatial awareness and problem-solving skills by piecing together beautiful images.
                                    </p>
                                    <Link to="/games/puzzle" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">
                                        Play Now <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Game 4: Fish Attention */}
                    <div className="col-md-6 col-lg-6 col-xl-3">
                        <div className="text-center border-primary border bg-white service-item h-100">
                            <div className="service-content d-flex align-items-center justify-content-center p-4 h-100">
                                <div className="service-content-inner">
                                    <div className="p-4"><i className="fas fa-fish fa-6x text-primary"></i></div>
                                    <h4 className="h4">Fish Attention</h4>
                                    <p className="my-3 text-muted">
                                        Focus your attention and track the correct swimming fish among a school of distractions.
                                    </p>
                                    <Link to="/games/fish-attention" className="btn btn-primary text-white px-4 py-2 my-2 btn-border-radius">
                                        Play Now <i className="fas fa-arrow-right ms-2"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        {/* --- Games Grid End --- */}
    </>
  );
}