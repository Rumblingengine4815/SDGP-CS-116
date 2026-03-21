import time
import requests
import statistics

def test_endpoint(url, num_requests=5):
    print(f"\n--- Load Testing {url} ---")
    latencies = []
    successes = 0
    for i in range(num_requests):
        try:
            start = time.perf_counter()
            r = requests.get(url, timeout=5)
            end = time.perf_counter()
            if r.status_code == 200:
                successes += 1
                latencies.append((end - start) * 1000)
        except Exception as e:
            print(f"Request failed: {e}")
    
    if latencies:
        print(f"Success Rate: {successes}/{num_requests}")
        print(f"Min Latency: {min(latencies):.2f} ms")
        print(f"Max Latency: {max(latencies):.2f} ms")
        print(f"Avg Latency: {statistics.mean(latencies):.2f} ms")
    else:
        print("All requests failed.")

if __name__ == "__main__":
    print("Beginning Zero-Downtime Ping Tests...")
    test_endpoint("http://localhost:8000/status", 5)
    test_endpoint("http://localhost:8000/api/market-trends", 5)
