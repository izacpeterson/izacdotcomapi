import express from "express";
const app = express();

app.use((req, res, next) => {
  // Function to get the client's IP address
  const getClientIp = (req) => {
    // The "X-Forwarded-For" header will usually contain a list of IPs, with the original client's IP first.
    const forwardedIpsStr = req.header("x-forwarded-for");
    if (forwardedIpsStr) {
      // 'x-forwarded-for' header may return multiple IP addresses in the format: "client IP, proxy 1 IP, proxy 2 IP"
      // Therefore, the client IP is the first one in the list
      return forwardedIpsStr.split(",")[0];
    }
    // If the "X-Forwarded-For" header is not present, fallback to the direct connection remote address
    return req.connection.remoteAddress;
  };

  req.clientIp = getClientIp(req);
  next();
});

app.get("/", (req, res) => {
  console.log("new request");
  res.json({ message: "Hello World!" });
});

app.get("/weather", (req, res) => {
  const id = req.query.id;
  const weather = req.query.weather;
});

app.get("/time", async (req, res) => {
  console.log(req.clientIp);
  let url = `http://worldtimeapi.org/api/ip/${req.clientIp}`;
  const response = await fetch(url);
  const data = await response.json();
  res.json({ time: data, clientIp: req.clientIp });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
