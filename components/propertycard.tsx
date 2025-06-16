// "use client"

// import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native"

// interface PropertyCardProps {
//   property: {
//     id: number
//     title: string
//     location: string
//     price: number
//     bedrooms: number
//     bathrooms: number
//     area: number
//     type: string
//     image: string
//     isAvailable: boolean
//     rating: number
//   }
// }

// export function PropertyCard({ property }: PropertyCardProps) {
//   const screenWidth = Dimensions.get("window").width
//   const isDesktop = screenWidth >= 1024

//   return (
//     <TouchableOpacity style={[styles.card, isDesktop && styles.desktopCard]}>
//       <Image source={{ uri: property.image }} style={[styles.image, isDesktop && styles.desktopImage]} />
//       <View style={[styles.content, isDesktop && styles.desktopContent]}>
//         <View style={styles.header}>
//           <Text style={[styles.title, isDesktop && styles.desktopTitle]} numberOfLines={2}>
//             {property.title}
//           </Text>
//           <View style={[styles.statusBadge, property.isAvailable ? styles.available : styles.rented]}>
//             <Text style={[styles.statusText, property.isAvailable ? styles.availableText : styles.rentedText]}>
//               {property.isAvailable ? "Available" : "Rented"}
//             </Text>
//           </View>
//         </View>

//         <Text style={[styles.location, isDesktop && styles.desktopLocation]} numberOfLines={1}>
//           📍 {property.location}
//         </Text>
//         <Text style={[styles.price, isDesktop && styles.desktopPrice]}>${property.price}/month</Text>

//         <View style={styles.details}>
//           <Text style={[styles.detailItem, isDesktop && styles.desktopDetailItem]}>🛏️ {property.bedrooms} bed</Text>
//           <Text style={[styles.detailItem, isDesktop && styles.desktopDetailItem]}>🚿 {property.bathrooms} bath</Text>
//           {/* <Text style={[styles.detailItem, isDesktop && styles.desktopDetailItem]}>📐 {property.area} sqft</Text> */}
//         </View>

//         <View style={styles.footer}>
//           <Text style={[styles.type, isDesktop && styles.desktopType]}>{property.type}</Text>
//           {property.rating > 0 && (
//             <Text style={[styles.rating, isDesktop && styles.desktopRating]}>⭐ {property.rating}</Text>
//           )}
//         </View>
//       </View>
//     </TouchableOpacity>
//   )
// }

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: "hidden",
//   },
//   desktopCard: {
//     borderRadius: 16,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     backgroundColor: "#f0f0f0",
//   },
//   desktopImage: {
//     height: 240,
//   },
//   content: {
//     padding: 16,
//   },
//   desktopContent: {
//     padding: 20,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 8,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     flex: 1,
//     marginRight: 8,
//   },
//   desktopTitle: {
//     fontSize: 18,
//     marginBottom: 4,
//   },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   available: {
//     backgroundColor: "#E8F5E8",
//   },
//   rented: {
//     backgroundColor: "#FFE8E8",
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   availableText: {
//     color: "#2E7D32",
//   },
//   rentedText: {
//     color: "#D32F2F",
//   },
//   location: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 8,
//   },
//   desktopLocation: {
//     fontSize: 15,
//     marginBottom: 12,
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#007AFF",
//     marginBottom: 12,
//   },
//   desktopPrice: {
//     fontSize: 20,
//     marginBottom: 16,
//   },
//   details: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   detailItem: {
//     fontSize: 13,
//     color: "#666",
//   },
//   desktopDetailItem: {
//     fontSize: 14,
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   type: {
//     fontSize: 14,
//     color: "#007AFF",
//     fontWeight: "500",
//   },
//   desktopType: {
//     fontSize: 15,
//   },
//   rating: {
//     fontSize: 14,
//     color: "#FF9500",
//   },
//   desktopRating: {
//     fontSize: 15,
//   },
// })

"use client"

import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native"

interface PropertyCardProps {
  property: {
    id: number | string
    title: string
    location: string
    price: number
    bedrooms: number
    bathrooms: number
    area: number
    type: string
    image: string
    isAvailable: boolean
    rating: number
  }
  onPress?: (property: any) => void
}

export function PropertyCard({ property, onPress }: PropertyCardProps) {
  const screenWidth = Dimensions.get("window").width
  const isDesktop = screenWidth >= 1024

  const handlePress = () => {
    if (onPress) {
      onPress(property)
    }
  }

  return (
    <TouchableOpacity 
      style={[styles.card, isDesktop && styles.desktopCard]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: property.image }} 
        style={[styles.image, isDesktop && styles.desktopImage]} 
        defaultSource={{ uri: '/placeholder.svg?height=200&width=300' }}
      />
      <View style={[styles.content, isDesktop && styles.desktopContent]}>
        <View style={styles.header}>
          <Text style={[styles.title, isDesktop && styles.desktopTitle]} numberOfLines={2}>
            {property.title}
          </Text>
          <View style={[styles.statusBadge, property.isAvailable ? styles.available : styles.rented]}>
            <Text style={[styles.statusText, property.isAvailable ? styles.availableText : styles.rentedText]}>
              {property.isAvailable ? "Available" : "Rented"}
            </Text>
          </View>
        </View>

        <Text style={[styles.location, isDesktop && styles.desktopLocation]} numberOfLines={1}>
          📍 {property.location}
        </Text>
        <Text style={[styles.price, isDesktop && styles.desktopPrice]}>${property.price}/month</Text>

        <View style={styles.details}>
          <Text style={[styles.detailItem, isDesktop && styles.desktopDetailItem]}>
            🛏️ {property.bedrooms} {property.bedrooms === 1 ? 'bed' : 'beds'}
          </Text>
          <Text style={[styles.detailItem, isDesktop && styles.desktopDetailItem]}>
            🚿 {property.bathrooms} {property.bathrooms === 1 ? 'bath' : 'baths'}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.type, isDesktop && styles.desktopType]}>{property.type}</Text>
          {property.rating > 0 && (
            <Text style={[styles.rating, isDesktop && styles.desktopRating]}>⭐ {property.rating}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  desktopCard: {
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
  },
  desktopImage: {
    height: 240,
  },
  content: {
    padding: 16,
  },
  desktopContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  desktopTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  available: {
    backgroundColor: "#E8F5E8",
  },
  rented: {
    backgroundColor: "#FFE8E8",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  availableText: {
    color: "#2E7D32",
  },
  rentedText: {
    color: "#D32F2F",
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  desktopLocation: {
    fontSize: 15,
    marginBottom: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 12,
  },
  desktopPrice: {
    fontSize: 20,
    marginBottom: 16,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    fontSize: 13,
    color: "#666",
  },
  desktopDetailItem: {
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  type: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  desktopType: {
    fontSize: 15,
  },
  rating: {
    fontSize: 14,
    color: "#FF9500",
  },
  desktopRating: {
    fontSize: 15,
  },
})