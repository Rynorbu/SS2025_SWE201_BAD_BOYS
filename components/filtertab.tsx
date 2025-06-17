import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

interface FilterTabsProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
}

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const filters = ['All', 'Available', 'Rented', 'Pending']

  return (
    <View style={styles.container}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            activeFilter === filter && styles.activeFilter
          ]}
          onPress={() => onFilterChange(filter)}
        >
          <Text style={[
            styles.filterText,
            activeFilter === filter && styles.activeFilterText
          ]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeFilter: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '600',
  },
})