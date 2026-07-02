import { StyleSheet, Platform } from 'react-native';

export const pageStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    bgDark: {
        backgroundColor: '#121212',
    },
    contentContainer: {
        padding: 20,
        maxWidth: 650,
        alignSelf: 'center',
        width: '100%',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#28526e',
        borderBottomWidth: 2,
        borderBottomColor: '#e8ecef',
        paddingBottom: 12,
        marginBottom: 20,
        marginTop: 10,
    },
    pageTitleDark: {
        color: '#a0c0d8',
        borderBottomColor: '#2d2d2d',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#70757a',
    },
    emptyMessage: {
        color: '#70757a',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: 40,
        fontSize: 16,
    },
    successContainer: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e8ecef',
        marginTop: 32,
        alignSelf: 'center',
        width: '90%',
        maxWidth: 500,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 20,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    successContainerDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#2d2d2d',
    },
    successIcon: {
        fontSize: 72,
        color: '#28a745',
        marginBottom: 16,
        lineHeight: 72,
        textAlign: 'center',
    },
    successTitle: {
        color: '#28a745',
        fontSize: 28,
        fontWeight: '800',
        marginBottom: 8,
    },
    successText: {
        fontSize: 16,
        color: '#202124',
        marginBottom: 4,
        fontWeight: '500',
    },
    successSubtext: {
        fontSize: 13,
        color: '#70757a',
        textAlign: 'center',
    },
    summaryBox: {
        marginTop: 20,
        backgroundColor: '#e9ecef',
        padding: 20,
        borderRadius: 12,
        alignItems: 'flex-end',
    },
    summaryBoxDark: {
        backgroundColor: '#252525',
    },
    summaryTotal: {
        fontSize: 18,
        fontWeight: '800',
        color: '#28526e',
        marginBottom: 16,
    },
    summaryTotalDark: {
        color: '#a0c0d8',
    },
    summaryTotalVal: {
        color: '#00c2e8',
    },
    checkoutBtn: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
        ...Platform.select({
            ios: {
                shadowColor: '#28a745',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    checkoutBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textDark: {
        color: '#ffffff',
    },
    textMutedDark: {
        color: '#a0a0a0',
    },
});