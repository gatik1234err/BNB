import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

// Generate some mock history data for the chart
const generateData = () => {
    let base = 50;
    const data = [];
    for (let i = 0; i < 60; i++) {
        base = base + (Math.random() - 0.5) * 5;
        if (base > 99) base = 99;
        if (base < 1) base = 1;
        data.push({
            time: `-${60 - i}m`,
            probability: Number(base.toFixed(2))
        });
    }
    return data;
};

export default function ChartArea() {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(generateData());
        // Simulate live updates
        const interval = setInterval(() => {
            setData(currentData => {
                const lastProb = currentData[currentData.length - 1].probability;
                let newProb = lastProb + (Math.random() - 0.5) * 3;
                if (newProb > 99) newProb = 99;
                if (newProb < 1) newProb = 1;

                const newData = [...currentData.slice(1)];
                newData.push({
                    time: 'Just now',
                    probability: Number(newProb.toFixed(2))
                });
                // Shift time labels slightly
                return newData.map((d, i) => ({
                    ...d,
                    time: i === newData.length - 1 ? 'Now' : `-${newData.length - 1 - i}m`
                }));
            });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '4px' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '4px' }}>{label}</p>
                    <p style={{ margin: 0, color: 'var(--neon-green)', fontWeight: 'bold' }}>
                        {payload[0].value}% YES
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="panel chart-area">
            <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📈 Market Trend (Simulated)
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Live Updates</div>
            </div>
            <div className="panel-content" style={{ padding: '16px 16px 16px 0' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis
                            dataKey="time"
                            stroke="var(--text-muted)"
                            fontSize={11}
                            tickMargin={10}
                            minTickGap={30}
                        />
                        <YAxis
                            domain={[0, 100]}
                            stroke="var(--text-muted)"
                            fontSize={11}
                            tickFormatter={(val) => `${val}%`}
                            width={40}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={50} stroke="var(--text-muted)" strokeDasharray="3 3" />
                        <Line
                            type="monotone"
                            dataKey="probability"
                            stroke="var(--color-buy)"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: 'var(--bg-main)', stroke: 'var(--color-buy)', strokeWidth: 2 }}
                            isAnimationActive={true}
                            animationDuration={300}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
