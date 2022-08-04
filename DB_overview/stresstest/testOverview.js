import http from "k6/http"
import {check, sleep} from "k6"
import {Counter} from "k6/metrics"

let requests = new Counter("http_reqs");
let error1 = new Counter("errors");
let error2 = new Counter("errors");
let error3 = new Counter("errors");

export const options = {
  vus: 200,
  duration: "30s",
  thresholds: {}
}

export default function() {

  var product_id = Math.floor(Math.random()*100000);
  var url_product = "http://localhost:3005/api/products/" + JSON.stringify(product_id)
  var url_styles = "http://localhost:3005/api/products/"  + JSON.stringify(product_id) + "/styles"
  var url_related = "http://localhost:3005/api/products/"  + JSON.stringify(product_id) + "/related"

  let res1 = http.get(url_product);
  let success1 = check(res1,
    {"status is 200": r => r.status === 200,
    "transaction time < 200ms": r => r.timings.duration < 200,
    "transaction time < 100ms": r => r.timings.duration < 1000,
    "transaction time < 2000ms": r => r.timings.duration < 2000,
    "transaction time < 5000ms": r => r.timings.duration < 5000,
  });
  if (!success1) {
    error1.add("1")
  }

  let res2 = http.get(url_styles);
  let success2 = check(res2,
    {"status is 200": r => r.status === 200,
    "transaction time < 200ms": r => r.timings.duration < 200,
    "transaction time < 500ms": r => r.timings.duration < 500,
    "transaction time < 1000ms": r => r.timings.duration < 1000,
    "transaction time < 2000ms": r => r.timings.duration < 2000
  });
  if (!success2) {
    error2.add("1")
  }

  let res3 = http.get(url_related);
  let success3 = check(res3,
    {"status is 200": r => r.status === 200,
    "transaction time < 200ms": r => r.timings.duration < 200,
    "transaction time < 100ms": r => r.timings.duration < 1000,
    "transaction time < 2000ms": r => r.timings.duration < 2000,
    "transaction time < 5000ms": r => r.timings.duration < 5000,
  });
  if (!success3) {
    error3.add("1")
  }
  sleep(1);
}