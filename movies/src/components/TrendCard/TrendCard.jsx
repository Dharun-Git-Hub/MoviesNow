import { useState, forwardRef } from 'react'
import { useNavigate } from 'react-router-dom'

const TrendCard = forwardRef(({ movie, isMain }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const navigate = useNavigate()

    const isActive = isMain || isHovered

    return (
        <div
            className='trend-div'
            onClick={() => navigate('/movie', { state: movie })}
            ref={ref}
        >
            <img
                src={movie.poster_url}
                alt={movie.title}
                className={isActive ? 'main-movie' : 'home-movies'}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
            {isActive && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span className='trend-name'>{movie.title}</span>
                    <span className='trend-desc'>{movie.description}</span>
                    <span className='trend-lang'>{movie.language}</span>
                </div>
            )}
        </div>
    )
})

export default TrendCard
