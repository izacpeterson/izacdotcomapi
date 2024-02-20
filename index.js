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
  let dt = req.query.dt;
  let date = new Date(parseInt(`${dt}000`));

  console.log(date);

  let timeString = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });

  let dayOfWeekString = date.toLocaleString("en-US", { weekday: "long" });
  let monthString = date.toLocaleString("en-US", { month: "long" });

  let dayOfMonthString = date.toLocaleString("en-US", { day: "numeric" });
  // add st nd rd th
  if (dayOfMonthString === "1" || dayOfMonthString === "21" || dayOfMonthString === "31") {
    dayOfMonthString += "st";
  } else if (dayOfMonthString === "2" || dayOfMonthString === "22") {
    dayOfMonthString += "nd";
  } else if (dayOfMonthString === "3" || dayOfMonthString === "23") {
    dayOfMonthString += "rd";
  } else {
    dayOfMonthString += "th";
  }

  let longString = `${dayOfWeekString}, ${monthString} ${dayOfMonthString} at ${timeString}`;

  res.json({ time: date, string: date.toLocaleString(), dayOfWeek: dayOfWeekString, month: monthString, dayOfMonth: dayOfMonthString, timeString: timeString, longString: longString });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
