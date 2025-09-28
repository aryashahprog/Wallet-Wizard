// components/ui/PieChart.tsx - Interactive Pie Chart for Wallet Wizard
import React from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

interface PieChartData {
  id: string;
  label: string;
  value: number;
  color: string;
  emoji?: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  strokeWidth?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  centerText?: string;
  onSlicePress?: (item: PieChartData) => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function PieChart({
  data,
  size = Math.min(screenWidth * 0.7, 280),
  strokeWidth = 0,
  showLabels = true,
  showLegend = true,
  centerText,
  onSlicePress
}: PieChartProps) {
  const [selectedSlice, setSelectedSlice] = (React as any).useState(null);
  
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Calculate percentages and cumulative angles
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithAngles = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    return {
      ...item,
      percentage,
      angle,
      startAngle: index === 0 ? 0 : data.slice(0, index).reduce((sum, prev) => sum + (prev.value / total) * 360, 0)
    };
  });

  // Create SVG path for pie slice
  const createPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius = 0) => {
    const startAngleRad = (startAngle - 90) * Math.PI / 180;
    const endAngleRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = center + outerRadius * Math.cos(startAngleRad);
    const y1 = center + outerRadius * Math.sin(startAngleRad);
    const x2 = center + outerRadius * Math.cos(endAngleRad);
    const y2 = center + outerRadius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    if (innerRadius === 0) {
      // Regular pie slice
      return `M ${center} ${center} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    } else {
      // Donut slice
      const x3 = center + innerRadius * Math.cos(endAngleRad);
      const y3 = center + innerRadius * Math.sin(endAngleRad);
      const x4 = center + innerRadius * Math.cos(startAngleRad);
      const y4 = center + innerRadius * Math.sin(startAngleRad);
      
      return `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
    }
  };

  // Calculate label position
  const getLabelPosition = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius * 0.7;
    const angle = (midAngle - 90) * Math.PI / 180;
    
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle)
    };
  };

  const handleSlicePress = (item: PieChartData) => {
    setSelectedSlice(selectedSlice === item.id ? null : item.id);
    onSlicePress?.(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <G>
            {dataWithAngles.map((item, index) => {
              const endAngle = item.startAngle + item.angle;
              const isSelected = selectedSlice === item.id;
              const adjustedRadius = isSelected ? radius + 5 : radius;
              
              return (
                <G key={item.id}>
                  <Path
                    d={createPath(item.startAngle, endAngle, adjustedRadius)}
                    fill={item.color}
                    stroke={strokeWidth > 0 ? '#fff' : 'none'}
                    strokeWidth={strokeWidth}
                    onPress={() => handleSlicePress(item)}
                  />
                  
                  {showLabels && item.percentage > 5 && (
                    <SvgText
                      {...getLabelPosition(item.startAngle, endAngle)}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#fff"
                      fontWeight="600"
                    >
                      {item.percentage.toFixed(0)}%
                    </SvgText>
                  )}
                </G>
              );
            })}
          </G>
          
          {centerText && (
            <SvgText
              x={center}
              y={center}
              textAnchor="middle"
              fontSize="16"
              fontWeight="bold"
              fill="#1e293b"
            >
              {centerText}
            </SvgText>
          )}
        </Svg>
      </View>

      {showLegend && (
        <View style={styles.legend}>
          {dataWithAngles.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.legendItem,
                selectedSlice === item.id && styles.legendItemSelected
              ]}
              onPress={() => handleSlicePress(item)}
            >
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <View style={styles.legendText}>
                <Text style={styles.legendLabel}>
                  {item.emoji} {item.label}
                </Text>
                <Text style={styles.legendValue}>
                  ${item.value.toFixed(0)} ({item.percentage.toFixed(1)}%)
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

// Example usage component for Wallet Wizard
export function SavingsPieChart() {
  const savingsData: PieChartData[] = [
    { id: 'food', label: 'Food & Dining', value: 450, color: '#10b981', emoji: '🍕' },
    { id: 'transport', label: 'Transportation', value: 320, color: '#3b82f6', emoji: '🚗' },
    { id: 'shopping', label: 'Shopping', value: 280, color: '#f59e0b', emoji: '🛍️' },
    { id: 'entertainment', label: 'Entertainment', value: 180, color: '#ef4444', emoji: '🎬' },
    { id: 'other', label: 'Other', value: 120, color: '#8b5cf6', emoji: '📱' },
  ];

  const totalSavings = savingsData.reduce((sum, item) => sum + item.value, 0);

  const handleSlicePress = (item: PieChartData) => {
    console.log('Pressed:', item.label);
  };

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Your Savings Breakdown</Text>
      <PieChart
        data={savingsData}
        showLabels={true}
        showLegend={true}
        centerText={`$${totalSavings}`}
        onSlicePress={handleSlicePress}
        strokeWidth={2}
      />
    </View>
  );
}

// Challenge completion pie chart
export function ChallengeCompletionChart() {
  const challengeData: PieChartData[] = [
    { id: 'completed', label: 'Completed', value: 85, color: '#10b981', emoji: '✅' },
    { id: 'missed', label: 'Missed', value: 15, color: '#ef4444', emoji: '❌' },
  ];

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Challenge Success Rate</Text>
      <PieChart
        data={challengeData}
        showLabels={true}
        showLegend={true}
        centerText="85%"
        size={200}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    marginBottom: 20,
  },
  legend: {
    width: '100%',
    maxWidth: 300,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  legendItemSelected: {
    backgroundColor: '#e2e8f0',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  legendValue: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  exampleContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 16,
  },
});