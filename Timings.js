import System;

var unixEpoch = new DateTime(1970, 1, 1, 1, 0, 0, DateTimeKind.Utc).ToLocalTime();
var dt = unixEpoch.AddMilliseconds(1342287641122);

print("DateTime:"+dt.ToString());
