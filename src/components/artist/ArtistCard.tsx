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
  return (
    <div className="artist-card">
      <Link to={`/artist/${artist.id}`} className="artist-card-link">
        <div className="artist-image-container">
          <img
            src={artist.profilePicture || "/images/placeholder-profile.jpg"}
            alt={getTextByLanguage(artist.name, language)}
            className="artist-image"
            loading="lazy"
          />
          {artist.featured && (
            <div className="artist-featured-badge">
              <span>{language === "en" ? "Featured" : "مميز"}</span>
            </div>
          )}
        </div>
        <div className="artist-info">
          <h3 className="artist-name">
            {getTextByLanguage(artist.name, language)}
          </h3>
          <p className="artist-location">
            {getTextByLanguage(artist.location, language)}
          </p>
          <p className="artist-bio">
            {getTextByLanguage(artist.bio, language).length > 100
              ? `${getTextByLanguage(artist.bio, language).substring(
                  0,
                  100
                )}...`
              : getTextByLanguage(artist.bio, language)}
          </p>
          <div className="artist-tags">
            {artist.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="artist-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArtistCard;
