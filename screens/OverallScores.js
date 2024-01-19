import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Button
} from 'react-native';
import {
    collection,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import { db } from '../firebase';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';


const OverallScores = ({ route }) => {
    const { uid } = route.params;
    console.log('UID: ', uid);
    const [bars, setBars] = useState([]);
    const [userRatings, setUserRatings] = useState([]);
    const [overallScores, setOverallScores] = useState([]); // Initialize with an empty array

    const navigation = useNavigation(); // Get the navigation object

    const navigateBackToBars = () => {
      // Navigate back to the Bars Screen
      navigation.goBack();
    };

    useEffect(() => {
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

        const fetchUserRatings = async () => {
            try {
                const userRatingsCollection = collection(db, 'users', uid, 'ratings');
                const userRatingsQuery = query(userRatingsCollection);
                const userRatingsSnapshot = await getDocs(userRatingsQuery);
                const userRatingsData = [];
                userRatingsSnapshot.forEach((doc) => {
                    userRatingsData.push(doc.data());
                });
                setUserRatings(userRatingsData);
            } catch (error) {
                console.error('Error fetching user ratings: ', error);
            }
        };

        fetchBars();
        fetchUserRatings();
    }, [uid]);

    useEffect(() => {
        // Calculate overall scores for each bar based on user ratings
        const calculateOverallScores = () => {
            const newOverallScores = [];
            bars.forEach((bar) => {
                const barRatings = userRatings.filter((rating) => rating.barName === bar.name);
                if (barRatings.length > 0) {
                    const totalScore = barRatings.reduce((acc, rating) => {
                        return (
                            acc +
                            parseInt(rating.priceRating) +
                            parseInt(rating.tasteRating) +
                            parseInt(rating.looksRating) +
                            parseInt(rating.textureRating) +
                            parseInt(rating.lacqueringRating) +
                            parseInt(rating.temperatureRating)
                        );
                    }, 0);
                    newOverallScores.push({ name: bar.name, score: totalScore });
                }
            });
            setOverallScores(newOverallScores);
        };

        calculateOverallScores();
    }, [bars, userRatings]);

    return (
        <ScrollView style={tw`flex-1`} contentContainerStyle={tw`p-4`}>
            <Text style={tw`text-lg font-bold mb-4`}>Overall Scores</Text>
            {overallScores.map((bar) => (
                <View key={bar.name} style={tw`mb-4`}>
                    <Text style={tw`text-xl font-bold`}>{bar.name}</Text>
                    <Text style={tw`text-lg`}>Overall Score: {bar.score}</Text>
                </View>
            ))}
            <Button title="Go back to Bars" onPress={navigateBackToBars} />
        </ScrollView>
    );
};

export default OverallScores;
