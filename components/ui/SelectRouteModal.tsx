import { StyleSheet, View, Text, FlatList, Platform } from 'react-native'
import React from 'react'
import colors from '@/styles/colors'
import { deviceWidth, deviceHeight } from '@/utils/deviceDimensions'
import { FontAwesome } from '@expo/vector-icons'
import CustomPressable from './CustomPressable'
import RouteCard from './RouteCard'
import { SelectRouteModalProps } from '@/types/types'
import Modal from "react-native-modal";

export default function SelectRouteModal({modalVisible, setModalVisible, toggleModal, routes, handleRouteSelect}: SelectRouteModalProps) {
  return (
	<Modal
        isVisible={modalVisible}
        backdropOpacity={Platform.OS == "ios" ? 0.6 : 0.5}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={400}
        animationOutTiming={400}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => setModalVisible(false)}
        statusBarTranslucent
        deviceWidth={deviceWidth}
        deviceHeight={deviceHeight + 100}
        style={styles.modal}
      >
        <View style={styles.modalView}>
          <CustomPressable
            onPress={toggleModal}
            buttonStyle={styles.closeModal}
          >
            <FontAwesome name="close" size={24} color={colors.foreground} />
            <Text style={styles.selectText}>Select Route</Text>
          </CustomPressable>

          <FlatList
            horizontal
            initialNumToRender={3}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal
            data={routes}
            renderItem={({ item }) => (
              <RouteCard item={item} onSelect={handleRouteSelect} />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
        <View style={styles.swipeContainer}>
          <FontAwesome name="arrow-left" size={24} color={colors.background} />
          <Text style={styles.swipeText}>Swipe For More</Text>
          <FontAwesome name="arrow-right" size={24} color={colors.background} />
        </View>
      </Modal>
  )
}

const styles = StyleSheet.create({
	modal: {
	  flex: 1,
	  justifyContent: "center",
	  alignItems: "center",
	  elevation: 0,
	},
	modalView: {
	  height: "65%",
	  width: "auto",
	  alignItems: "flex-start",
	  justifyContent: "center",
	  borderRadius: 20,
	  backgroundColor: colors.muted,
	},
	closeModal: {
		padding: 10,
		paddingLeft: 20,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		marginTop: 10,
	},
	selectText: {
	  fontSize: 24,
	  fontFamily: "Barlow-Black",
	  color: colors.foreground,
	  marginLeft: 32,
	},
	swipeContainer: {
	  flexDirection: "row",
	  alignItems: "center",
	  justifyContent: "space-between",
	},
	swipeText: {
	  fontSize: 24,
	  fontFamily: "Barlow-Bold",
	  margin: 15,
	  color: colors.background,
	},
  });