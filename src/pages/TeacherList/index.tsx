import React, { useState } from 'react';
import {ScrollView, View, Text, TextInput} from 'react-native';
import { BorderlessButton, RectButton } from 'react-native-gesture-handler';
import PageHeader from '../../components/PageHeader';
import TeacherItem, {Teacher} from '../../components/TeacherItem';
import AsyncStorage from '@react-native-community/async-storage';

import { Feather } from '@expo/vector-icons';

import styles from './styles';
import api from '../../services/api';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList(){
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [favorites, setFavorites] = useState<number[]>([]);

    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites (){
        AsyncStorage.getItem('favorites').then(response => {
            if(response) {
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                });
                setFavorites(favoritedTeachersIds);
            }
        });
    }

    useFocusEffect(() => {
        loadFavorites();
    });

    function handleToggleFiltersVisible(){
        setIsFilterVisible(!isFilterVisible);
    }
    async function handleFiltersSubmit (){
        loadFavorites();
        const response = await api.get('classes', {
            params: {
                subject,
                week_day,
                time,
            }
        });

        setIsFilterVisible(false);
        setTeachers(response.data);
    }

    return(
        <View style={styles.container}>
            <PageHeader
                title="Proffys Disponiveis"
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name='filter' size={20} color="#fff" />
                    </BorderlessButton>
                )}
            >
                { isFilterVisible && (
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput
                            style={styles.input}
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholder="Qual a matéria"
                            placeholderTextColor="#c1bccc"
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput
                                    style={styles.input}
                                    value={week_day}
                                    onChangeText={text => setWeekDay(text)}
                                    placeholder="Qual o dia"
                                    placeholderTextColor="#c1bccc"

                                />
                            </View>

                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput
                                    style={styles.input}
                                    value={time}
                                    onChangeText={text => setTime(text)}
                                    placeholder="Qual horario"
                                    placeholderTextColor="#c1bccc"

                                />
                            </View>
                        </View>
                        <RectButton style={styles.submitButton} onPress={handleFiltersSubmit}>
                            <Text style={styles.submitButtonText}>
                                Aplicar
                            </Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
                {teachers.map((teacher: Teacher) => {
                    return (
                        <TeacherItem
                            key={teacher.id}
                            teacher={teacher}
                            favorited={favorites.includes(teacher.id)}
                        />)
                })}
            </ScrollView>            
        </View>
    );
}

export default TeacherList;