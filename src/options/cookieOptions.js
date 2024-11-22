const cookieOptions = {
    httpOnly: true, // Prevent JavaScript access
    secure: true, 
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/' // Available across the entire site
};

module.exports = cookieOptions;