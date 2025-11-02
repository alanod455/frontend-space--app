import './styles.css';
export default function About() {
  return (
    <section className="about-container">
      <h1>About the App</h1>
      <p>
        Welcome to your productivity galaxy ✨
        This app transforms your time into focused sessions, helping you organize tasks, track progress, and celebrate achievements.
      </p>
      <p>
        Designed with a cosmic dark theme and glowing accents, every detail reflects clarity, motivation, and elegance.
        Whether you're studying, working, or creating — this space is yours to thrive.
      </p>
      <p>
        Built using React and Django, the app supports real-time editing, animated feedback, and a modular structure ready for future expansion.
      </p>
      <p className="slogan">Space where time turns into a galaxy of focus ✨</p>
      <h3 className="creator">
        Designed and developed by{" "}
        <a
          href="https://github.com/alanod455"
          target="_blank"
          rel="noopener noreferrer"
          className="creator-link"
        >
          Alanoud Almarshad
        </a>.
      </h3>
    </section>
  );
}