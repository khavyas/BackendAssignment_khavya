import jwt from 'jsonwebtoken';

export function issueToken(userData) {
  return jwt.sign({ user: userData }, 'e16c1cf34e3f6h7if9g8k11', { expiresIn: '1d' });
}

function auth(req, res, next) {
  // Extract the token from the Authorization header.
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) return res.status(401).json({ message: 'No token, authorization denied' });

  const token = bearerHeader.split(' ')[1]; // Assuming the header is "Bearer token"

  try {
    const decoded = jwt.verify(token, 'e16c1cf34e3f6h7if9g8k11');
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

export default auth;






// import jwt from 'jsonwebtoken';

// function auth(req, res, next) {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  
//     try {
//       const decoded = jwt.verify(token, 'e16c1cf34e3f6h7if9g8k11'); 
//       req.user = decoded.user;
//       next();
//     } catch (err) {
//       res.status(401).json({ message: 'Token is not valid' });
//     }
//   }

// export default auth;

