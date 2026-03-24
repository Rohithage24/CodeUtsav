import React, { useEffect, useState } from 'react';

const TrendingSection = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&maxResults=10');
        const data = await response.json();
        setTrending(data.items || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending books:", error);
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  return (
    <section className="content-section">
      <div className="section-header">
        <span className="line"></span>
        <h2 className="section-title">Recently <span className="text-gradient">Trending</span></h2>
        <span className="line"></span>
      </div>

      <div className="trending-scroll-container">
        {loading ? (
          // Simple loading placeholders
          [1, 2, 3, 4].map((n) => <div key={n} className="trending-card-skeleton"></div>)
        ) : (
          trending.map((item) => {
            const info = item.volumeInfo;
            return (
              <div key={item.id} className="trending-card-glass">
                <div className="trending-cover">
                  {info.imageLinks?.thumbnail ? (
                    <img src={info.imageLinks.thumbnail} alt={info.title} />
                  ) : (
                    <div className="no-cover">📖</div>
                  )}
                </div>
                <div className="trending-info">
                  <h4>{info.title.length > 30 ? info.title.substring(0, 30) + "..." : info.title}</h4>
                  <p>{info.authors?.[0] || "Unknown Author"}</p>
                  <a href={info.previewLink} target="_blank" rel="noreferrer" className="trend-btn">
                    Read Preview
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default TrendingSection;