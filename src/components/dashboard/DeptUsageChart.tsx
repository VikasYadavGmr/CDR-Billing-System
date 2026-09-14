import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/billingCalculator';

interface DeptUsageChartProps {
  data: Array<{
    department: string;
    calls: number;
    durationHours: number;
    cost: number;
  }>;
}

export const DeptUsageChart: React.FC<DeptUsageChartProps> = ({ data }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm h-[380px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-foreground">Department-wise Usage & Cost</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Telephone billing consumption by airport department</p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="department"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#334155' }}
              width={130}
            />
            <Tooltip
              cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              formatter={(value: any, name: any) => {
                if (name === 'cost') return [formatCurrency(Number(value)), 'Monthly Cost'];
                return [value, name];
              }}
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="cost" name="cost" fill="#0284c7" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
