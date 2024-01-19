import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Button,
    TextInput,
    ScrollView,
    Modal,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    setDoc,
    doc,
    getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';


const BarsScreen = ({ route }) => {
    const { uid } = route.params;
    console.log('UID: ', uid);
    const [bars, setBars] = useState([]);
    const [selectedBar, setSelectedBar] = useState(null);
    const [newBarName, setNewBarName] = useState('');
    const [isAddingBar, setIsAddingBar] = useState(false);
    const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);
    const [priceRating, setPriceRating] = useState(0);
    const [tasteRating, setTasteRating] = useState(0);
    const [looksRating, setLooksRating] = useState(0);
    const [textureRating, setTextureRating] = useState(0);
    const [lacqueringRating, setLacqueringRating] = useState(0);
    const [temperatureRating, setTemperatureRating] = useState(0);

    const [modalTitle, setModalTitle] = useState('');
    const [selectedBarRatings, setSelectedBarRatings] = useState(null);

    const navigation = useNavigation(); // Get the navigation object

    const navigateToOverallScores = () => {
        // Navigate to the Overall Scores Screen
        navigation.navigate('Overall Scores');
    };

    const fetchBars = async () => {
        try {
            const barsCollection = collection(db, 'bars');
            const barsSnapshot = await getDocs(barsCollection);
            const barsData = [];
            barsSnapshot.forEach((doc) => {
                barsData.push({ id: doc.id, ...doc.data() });
            });
            setBars(barsData);
        } catch (error) {
            console.error('Error fetching bars: ', error);
        }
    };

    useEffect(() => {
        fetchBars();
    }, []);

    const handleAddRating = async (barId) => {
        setSelectedBar(barId);
        const selectedBarObj = bars.find((bar) => bar.id === barId);
        setModalTitle(`Rate ${selectedBarObj.name}`);

        try {
            const userRatingsCollection = collection(db, 'users', uid, 'ratings');
            const ratingsDoc = await getDoc(doc(userRatingsCollection, barId));

            if (ratingsDoc.exists()) {
                setSelectedBarRatings(ratingsDoc.data());
            } else {
                setSelectedBarRatings(null);
            }
        } catch (error) {
            console.error('Error fetching ratings: ', error);
            setSelectedBarRatings(null);
        }

        setIsRatingModalVisible(true);
    };

    const handleAddBar = async () => {
        setIsAddingBar(true);
    };

    const handleSubmitBar = async () => {
        try {
            if (newBarName) {
                const barCollection = collection(db, 'bars');
                const newBarDocRef = await addDoc(barCollection, {
                    name: newBarName,
                });
                const newBar = { id: newBarDocRef.id, name: newBarName };
                setBars((prevBars) => [...prevBars, newBar]);
                setNewBarName('');
                setIsAddingBar(false);
            }
        } catch (error) {
            console.error('Error adding a new bar: ', error);
        }
    };

    const handleRatingSubmit = async () => {
        try {
            if (uid) {
                const userRatingsCollection = collection(db, 'users', uid, 'ratings');
                const ratingsDocRef = doc(userRatingsCollection, selectedBar);

                const existingRatingsDoc = await getDoc(ratingsDocRef);

                const updatedRatings = {
                    barName: modalTitle.replace('Rate ', ''),
                    priceRating: priceRating || (existingRatingsDoc.exists() ? existingRatingsDoc.data().priceRating : 0),
                    tasteRating: tasteRating || (existingRatingsDoc.exists() ? existingRatingsDoc.data().tasteRating : 0),
                    looksRating: looksRating || (existingRatingsDoc.exists() ? existingRatingsDoc.data().looksRating : 0),
                    textureRating: textureRating || (existingRatingsDoc.exists() ? existingRatingsDoc.data().textureRating : 0),
                    lacqueringRating: lacqueringRating || (existingRatingsDoc.exists() ? existingRatingsDoc.data().lacqueringRating : 0),
                    temperatureRating: temperatureRating || (existingRatingsDoc.exists() ? existingRatingsDoc.data().temperatureRating : 0),
                };

                await setDoc(ratingsDocRef, updatedRatings);

                setIsRatingModalVisible(false);
                resetState();
            }
        } catch (error) {
            console.error('Error storing ratings: ', error);
        }
    };

    const resetState = () => {
        setLacqueringRating(0);
        setLooksRating(0);
        setPriceRating(0);
        setTasteRating(0);
        setTextureRating(0);
        setTemperatureRating(0);
    };

    return (
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
            <View style={tw`mb-4`}>
                <Text style={tw`text-lg font-bold`}>LIST OF BARS</Text>
                {isAddingBar ? (
                    <View>
                        <TextInput
                            style={tw`p-2 border border-gray-300 rounded mb-2`}
                            placeholder="Enter Bar Name"
                            value={newBarName}
                            onChangeText={(text) => setNewBarName(text)}
                        />
                        <Button title="Submit Bar" onPress={handleSubmitBar} />
                    </View>
                ) : (
                    <Button title="Add Bar" onPress={handleAddBar} />
                )}
            </View>
            <View style={tw`flex items-center`}>
                {bars.map((bar) => (
                    <TouchableOpacity
                        key={bar.id}
                        style={tw`mb-2 bg-black w-100 h-14 text-[#FFF] justify-center`}
                        onPress={() => handleAddRating(bar.id)}
                    >
                        <Text style={tw`text-lg text-white text-center`}>{bar.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Modal visible={isRatingModalVisible} transparent={true} animationType="slide">
                <TouchableOpacity
                    style={tw`flex-1 justify-center`}
                    onPress={() => setIsRatingModalVisible(false)}
                >
                    <View style={tw`bg-white p-4 m-4 rounded absolute bottom-0 left-0 right-0`}>
                        <Text style={tw`text-lg font-bold mb-2`}>{modalTitle}</Text>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'position' : undefined}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 300}
                        >
                            <View style={tw`mb-2`}>
                                <Text>Price Rating (out of 10)</Text>
                                <TextInput
                                    style={tw`p-2 border border-gray-300 rounded`}
                                    keyboardType="numeric"
                                    value={priceRating.toString()}
                                    onChangeText={(text) => setPriceRating(text)}
                                />
                            </View>
                            <View style={tw`mb-2`}>
                                <Text>Taste Rating (out of 10)</Text>
                                <TextInput
                                    style={tw`p-2 border border-gray-300 rounded`}
                                    keyboardType="numeric"
                                    value={tasteRating.toString()}
                                    onChangeText={(text) => setTasteRating(text)}
                                />
                            </View>
                            <View style={tw`mb-2`}>
                                <Text>Looks Rating (out of 10)</Text>
                                <TextInput
                                    style={tw`p-2 border border-gray-300 rounded`}
                                    keyboardType="numeric"
                                    value={looksRating.toString()}
                                    onChangeText={(text) => setLooksRating(text)}
                                />
                            </View>
                            <View style={tw`mb-2`}>
                                <Text>Texture Rating (out of 10)</Text>
                                <TextInput
                                    style={tw`p-2 border border-gray-300 rounded`}
                                    keyboardType="numeric"
                                    value={textureRating.toString()}
                                    onChangeText={(text) => setTextureRating(text)}
                                />
                            </View>
                            <View style={tw`mb-2`}>
                                <Text>Lacquering Rating (out of 10)</Text>
                                <TextInput
                                    style={tw`p-2 border border-gray-300 rounded`}
                                    keyboardType="numeric"
                                    value={lacqueringRating.toString()}
                                    onChangeText={(text) => setLacqueringRating(text)}
                                />
                            </View>
                            <View style={tw`mb-2`}>
                                <Text>Temperature Rating (out of 10)</Text>
                                <TextInput
                                    style={tw`p-2 border border-gray-300 rounded`}
                                    keyboardType="numeric"
                                    value={temperatureRating.toString()}
                                    onChangeText={(text) => setTemperatureRating(text)}
                                />
                            </View>
                        </KeyboardAvoidingView>
                        <Button title="Submit Rating" onPress={handleRatingSubmit} />

                        {selectedBarRatings && (
                            <View style={tw`mb-15`}>
                                <Text style={tw`text-lg mb-2 ${selectedBarRatings.priceRating === 10 ? 'text-green-500' : 'text-black'}`}>Price Rating: {selectedBarRatings.priceRating}</Text>
                                <Text style={tw`text-lg mb-2 ${selectedBarRatings.tasteRating === 10 ? 'text-green-500' : 'text-black'}`}>Taste Rating: {selectedBarRatings.tasteRating}</Text>
                                <Text style={tw`text-lg mb-2 ${selectedBarRatings.looksRating === 10 ? 'text-green-500' : 'text-black'}`}>Looks Rating: {selectedBarRatings.looksRating}</Text>
                                <Text style={tw`text-lg mb-2 ${selectedBarRatings.textureRating === 10 ? 'text-green-500' : 'text-black'}`}>Texture Rating: {selectedBarRatings.textureRating}</Text>
                                <Text style={tw`text-lg mb-2 ${selectedBarRatings.lacqueringRating === 10 ? 'text-green-500' : 'text-black'}`}>Lacquering Rating: {selectedBarRatings.lacqueringRating}</Text>
                                <Text style={tw`text-lg mb-2 ${selectedBarRatings.temperatureRating === 10 ? 'text-green-500' : 'text-black'}`}>Temperature Rating: {selectedBarRatings.temperatureRating}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Modal>
            <Button title="Go to Overall Scores" onPress={navigateToOverallScores} />
        </ScrollView>
    );
};

export default BarsScreen;
