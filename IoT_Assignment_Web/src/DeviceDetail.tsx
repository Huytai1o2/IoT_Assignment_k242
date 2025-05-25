import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';

async function getToken() {
  const response = await fetch('https://app.coreiot.io/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      username: 'iot.bku@coreiot.io',
      password: 'iotk242',
    }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();
  // The refreshToken is in data.refreshToken
  return data.token;
}

// Usage example:
getToken().then(token => {
  console.log('token:', token);
});

const DEVICE_INFO: Record<string, { name: string; desc: string; entityId: string }> = {
  '1': {
    name: 'Device 1',
    desc: 'Device collecting data in District 10 (HCMUT Campus 1)',
    entityId: '58be7930-31a8-11f0-aae0-0f85903b3644',
  },
  '2': {
    name: 'Device 2',
    desc: 'Device collecting data in Binh Duong (HCMUT Campus 2)',
    entityId: 'afdfeb60-333b-11f0-aae0-0f85903b3644',
  },
};

interface TelemetryPoint {
  ts: number;
  value: string;
}
interface TelemetryData {
  temperature?: TelemetryPoint[];
  humidity?: TelemetryPoint[];
  light?: TelemetryPoint[];
}

function formatTime(ts: number) {
  const date = new Date(ts);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function getMinMax(arr?: number[]) {
  if (!arr || arr.length === 0) return [0, 1];
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  return [min, max === min ? min + 1 : max];
}

function DeviceDetail() {
  const { id } = useParams();
  const device = DEVICE_INFO[id ?? ''] || { name: `Device ${id}`, desc: '', entityId: '' };
  const [data, setData] = useState<TelemetryData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!device.entityId) return;
    let stopped = false;
    setLoading(true);

    const fetchData = async() => {
      const entityType = 'DEVICE';
      const entityId = device.entityId;
      const endTs = Date.now();
      const startTs = endTs - 30 * 60 * 1000; // last 30 minutes
      const url = `https://app.coreiot.io/api/plugins/telemetry/${entityType}/${entityId}/values/timeseries?keys=temperature,humidity,light&startTs=${startTs}&endTs=${endTs}&interval=60000&limit=100&agg=AVG`;
      const token = await getToken();
      fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': `Bearer ${token}`
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then(setData)
        .catch((error) => {
          console.error('Error fetching telemetry data:', error);
        })
        .finally(() => {
          if (!stopped) setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 500);

    return () => {
      stopped = true;
      clearInterval(interval);
    };
  }, [device.entityId]);

  // Prepare data for charts
  const chartData = (data.temperature || []).map((point, idx) => ({
    time: formatTime(point.ts),
    temperature: parseFloat(point.value),
    humidity: data.humidity?.[idx] ? parseFloat(data.humidity[idx].value) : undefined,
    light: data.light?.[idx] ? parseFloat(data.light[idx].value) : undefined,
  }));

  const tempArr = chartData.map(d => d.temperature).filter(v => v !== undefined) as number[];
  const humArr = chartData.map(d => d.humidity).filter(v => v !== undefined) as number[];
  const lightArr = chartData.map(d => d.light).filter(v => v !== undefined) as number[];

  const [tempMin, tempMax] = getMinMax(tempArr);
  const [humMin, humMax] = getMinMax(humArr);
  const [lightMin, lightMax] = getMinMax(lightArr);

  return (
    <div className="main-container">
      <header className="header">
        <h1>{device.name} Detail</h1>
        <p className="subtitle">{device.desc}</p>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'underline' }}>← Back to Home</Link>
      </header>
      <section className="entities-section">
        <h2>Last 30 Minutes Charts</h2>
        <div style={{ width: '100%', display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {/* Temperature Chart */}
          <div style={{ flex: 1, minWidth: 320, height: 350, background: '#fff', borderRadius: 16, padding: 24 }}>
            <h3 style={{ textAlign: 'center' }}>Temperature (°C)</h3>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis
                    domain={[tempMin, tempMax]}
                    tickCount={Math.ceil((tempMax - tempMin) / 0.01) + 1}
                    tickFormatter={v => v.toFixed(2)}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#e67e22" name="Temperature (°C)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Humidity Chart */}
          <div style={{ flex: 1, minWidth: 320, height: 350, background: '#fff', borderRadius: 16, padding: 24 }}>
            <h3 style={{ textAlign: 'center' }}>Humidity (%)</h3>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis
                    domain={[humMin, humMax]}
                    tickCount={Math.ceil((humMax - humMin) / 0.01) + 1}
                    tickFormatter={v => v.toFixed(2)}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="humidity" stroke="#3498db" name="Humidity (%)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Light Chart */}
          <div style={{ flex: 1, minWidth: 320, height: 350, background: '#fff', borderRadius: 16, padding: 24 }}>
            <h3 style={{ textAlign: 'center' }}>Light (Lux)</h3>
            {loading ? (
              <span>Loading...</span>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis
                    domain={[lightMin, lightMax]}
                    tickCount={Math.ceil((lightMax - lightMin) / 0.01) + 1}
                    tickFormatter={v => v.toFixed(2)}
                  />
                  <Tooltip />
                  <Line type="monotone" dataKey="light" stroke="#f1c40f" name="Light (Lux)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DeviceDetail;