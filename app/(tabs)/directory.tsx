import TreeCard from "@/components/ui/TreeCard";
import { colors } from "@/styles";
import { Tree } from "@/types/types";
import { useSQLiteContext } from "expo-sqlite/next";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";

export default function Directory() {
  const db = useSQLiteContext();
  const [trees, setTrees] = useState<Tree[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const rows = await db.getAllAsync("SELECT * FROM tree");
        setTrees(rows as Tree[]);
      } catch (error) {
        // TODO: Better error handling
        console.error(error);
      }
    }

    fetchData();
  }, [db]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        horizontal
        initialNumToRender={3}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={trees}
        renderItem={({ item }) => <TreeCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 40,
    fontFamily: "Barlow",
  },
});
