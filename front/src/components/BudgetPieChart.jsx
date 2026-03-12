import * as React from 'react';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const categoryColors = {
  loyer: '#f59e0b',
  alimentaire: '#10b981',
  shopping: '#3b82f6',
  autre: '#8b5cf6',
};

const StyledText = styled('text')({
  fill: '#1f2937',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 18,
  fontWeight: 600,
});

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function BudgetPieChart({ budgets }) {
  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + b.montant, 0);
  const totalDepense = Object.values(budgets).reduce((sum, b) => sum + (b.depense || 0), 0);

  const categoryData = Object.entries(budgets).map(([key, budget]) => ({
    id: key,
    label: budget.label,
    value: budget.montant,
    percentage: (budget.montant / totalBudget) * 100,
    color: categoryColors[key],
  }));

  const categoryDetailData = Object.entries(budgets).flatMap(([key, budget]) => {
    const depense = budget.depense || 0;
    const reste = budget.montant - depense;
    const baseColor = categoryColors[key];
    
    return [
      {
        id: `${key}-depense`,
        label: 'Dépensé',
        value: depense,
        percentage: (depense / budget.montant) * 100,
        color: baseColor,
      },
      {
        id: `${key}-reste`,
        label: 'Disponible',
        value: reste,
        percentage: (reste / budget.montant) * 100,
        color: hexToRgba(baseColor, 0.3),
      },
    ];
  }).filter(item => item.value > 0);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const innerRadius = isMobile ? 35 : 50;
  const middleRadius = isMobile ? 75 : 110;

  return (
    <div className="w-full">
      <div className="flex justify-center" style={{ height: isMobile ? 280 : 400 }}>
        <PieChart
          series={[
            {
              innerRadius,
              outerRadius: middleRadius,
              data: categoryData,
              arcLabel: (item) => `${item.percentage.toFixed(0)}%`,
              valueFormatter: ({ value }) =>
                `${value}€ / ${totalBudget}€ (${((value / totalBudget) * 100).toFixed(0)}%)`,
              highlightScope: { fade: 'global', highlight: 'item' },
              highlighted: { additionalRadius: 5 },
              cornerRadius: 5,
            },
            {
              innerRadius: middleRadius,
              outerRadius: middleRadius + 25,
              data: categoryDetailData,
              arcLabel: (item) => !isMobile && item.value > 50 ? `${item.value.toFixed(0)}€` : '',
              arcLabelRadius: isMobile ? 95 : 145,
              valueFormatter: ({ value }) =>
                `${value.toFixed(0)}€`,
              highlightScope: { fade: 'global', highlight: 'item' },
              highlighted: { additionalRadius: 3 },
              cornerRadius: 3,
            },
          ]}
          sx={{
            [`& .${pieArcLabelClasses.root}`]: {
              fontSize: '12px',
              fontWeight: 600,
              fill: 'white',
            },
          }}
          margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <PieCenterLabel>Budget</PieCenterLabel>
        </PieChart>
      </div>
      
      <div className="mt-6 grid grid-cols-2 gap-4">
        {Object.entries(budgets).map(([key, budget]) => {
          const depense = budget.depense || 0;
          const reste = budget.montant - depense;
          const percentage = (depense / budget.montant) * 100;
          
          return (
            <div key={key} className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: categoryColors[key] }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{budget.icon} {budget.label}</span>
                  <span className="text-sm text-gray-600">{percentage.toFixed(0)}%</span>
                </div>
                <div className="text-xs text-gray-500">
                  {depense.toFixed(0)}€ / {budget.montant}€
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
