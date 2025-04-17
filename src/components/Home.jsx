import React from 'react'; 
import { Link } from 'react-router-dom'; 
function Home() { 
  return ( 
    <div className="home"> 
      <div className="hero-section"> 
        <h1>InteractiveLearning</h1> 
        <p> 
          Explore concepts, deepen your understanding, and master new topics through 
          interactive learning sessions tailored to your interests. 
        </p> 
        <div className="cta-buttons"> 
          <Link to="/chat" className="btn primary">Start Learning</Link> 
          <Link to="/topics" className="btn secondary">Browse Topics</Link> 
        </div> 
      </div> 
      <div className="features-section"> 
        <h2>Why Learn With Us?</h2> 
        <div className="feature-cards"> 
          <div className="feature-card"> 
            <h3>Personalized Learning</h3> 
            <p> 
              Get answers and explanations customized to your level of understanding 
              and learning style. 
            </p> 
          </div> 
          <div className="feature-card"> 
            <h3>Comprehensive Coverage</h3> 
            <p> 
              Explore topics across mathematics, science, programming, humanities, 
              and more with depth and clarity. 
            </p> 
          </div> 
          <div className="feature-card"> 
            <h3>Track Your Progress</h3> 
            <p> 
              Save your learning sessions and return to them anytime to continue 
              building your knowledge. 
            </p> 
          </div> 
        </div> 
      </div> 
      <div className="topic-section"> 
        <h2>Popular Learning Topics</h2> 
        <div className="topic-pills"> 
          <Link to="/chat?topic=mathematics" className="topic-pill">Mathematics</Link> 
          <Link to="/chat?topic=programming" className="topic-pill">Programming</Link> 
          <Link to="/chat?topic=science" className="topic-pill">Science</Link> 
          <Link to="/chat?topic=history" className="topic-pill">History</Link> 
          <Link to="/chat?topic=languages" className="topic-pill">Languages</Link> 
          <Link to="/chat?topic=arts" className="topic-pill">Arts & Literature</Link> 
          <Link to="/chat?topic=business" className="topic-pill">Business</Link> 
          <Link to="/chat?topic=technology" className="topic-pill">Technology</Link> 
        </div> 
      </div> 
    </div> 
  ); 
} 
export default Home;