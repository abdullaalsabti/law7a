import React from "react";
import { Link } from "react-router-dom";
import { Artist, Language } from "../../types";
import { getTextByLanguage } from "../../utils/language";
import "./ArtistCard.css";

interface ArtistCardProps {
  artist: Artist;
  language: Language;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, language }) => {
  const artistName = getTextByLanguage(artist.name, language);
  const artistLocation = getTextByLanguage(artist.location, language);
  const artistBio = getTextByLanguage(artist.bio, language);
  const truncatedBio =
    artistBio.length > 100 ? `${artistBio.substring(0, 100)}...` : artistBio;

  return (
    <Link to={`/artist/${artist.id}`} className="artist-card">
      <div className="artist-header">
        <div className="artist-avatar-container">
          <img
            src={artist.profilePicture || "/images/placeholder-profile.jpg"}
            alt={artistName}
            className="artist-image"
            loading="lazy"
          />
        </div>
        <div className="artist-header-info">
          <h3 className="artist-name">{artistName}</h3>
          <p className="artist-location">{artistLocation}</p>
        </div>
      </div>

      <div className="artist-bio-container">
        <p className="artist-bio">{truncatedBio}</p>
      </div>

      <div className="artist-footer">
        {artist.tags && artist.tags.length > 0 && (
          <div className="artist-tags">
            {artist.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="artist-tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        {artist.featured && (
          <span className="artist-featured-badge">
            {language === "en" ? "Featured" : "مميز"}
          </span>
        )}
      </div>
    </Link>
  );
};

export default ArtistCard;
