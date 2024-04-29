import TreeCard from "@/components/ui/TreeCard";
import WaveBackground from "@/components/ui/WaveBackground";
import { colors } from "@/styles";
import { Tree } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite/next";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Directory() {
  const db = useSQLiteContext();
  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const trees = await db.getAllAsync(
          "SELECT * FROM trees GROUP BY species"
        );
        setTrees(trees as Tree[]);
      } catch (error) {
        // TODO: Better error handling
        console.error("Fetch Directory Data error: ", error);
      }
    }

    fetchData();
  }, [db]);

  return (
    <View style={styles.container}>
      <WaveBackground />
      <View style={styles.title}>
        <Text style={styles.text}>Tree Directory</Text>
      </View>
      <FlatList
        horizontal
        initialNumToRender={3}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={true}
        indicatorStyle="black"
        data={trees}
        renderItem={({ item }) => <TreeCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  title: {
    position: "absolute",
    top: 110,
    left: 50,
  },
  text: {
    fontSize: 52,
    color: colors.background,
    fontFamily: "Barlow-Bold",
  },
});
