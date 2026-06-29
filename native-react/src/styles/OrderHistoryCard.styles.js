import {Platform, StyleSheet} from "react-native";

export const historyCardStyles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#28a745',
        padding: 16,
        marginVertical: 12,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        ...Platform.select({
            ios: {
                shadowColor: '#28a745',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardDark: {
        backgroundColor: '#1a1a1a',
        borderColor: '#28a745',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f4',
        paddingBottom: 8,
        marginBottom: 12,
    },
    cardHeaderDark: {
        borderBottomColor: '#2d2d2d',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#28526e',
    },
    cardTitleDark: {
        color: '#a0c0d8',
    },
    statusBadge: {
        backgroundColor: '#28a745',
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    statusBadgeText: {
        color: '#ffffff',
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
    itemRow: {
        borderTopWidth: 1,
        borderTopColor: '#f1f3f4',
        marginTop: 12,
        paddingTop: 12,
    },
    itemRowDark: {
        borderTopColor: '#2d2d2d',
    },
    itemMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    imgPlaceholder: {
        width: 50,
        height: 50,
        backgroundColor: '#f1f3f4',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    imgPlaceholderDark: {
        backgroundColor: '#252525',
    },
    imgText: {
        fontSize: 20,
    },
    itemDetails: {
        flex: 1,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#202124',
        marginBottom: 2,
    },
    itemDesc: {
        fontSize: 12,
        color: '#5f6368',
        lineHeight: 16,
    },
    priceLabel: {
        fontSize: 11,
        color: '#70757a',
        marginTop: 2,
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 8,
        borderRadius: 8,
        marginTop: 4,
    },
    controlsRowDark: {
        backgroundColor: '#252525',
    },
    qtySelector: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyText: {
        fontSize: 13,
        color: '#333333',
    },
    qtyVal: {
        fontWeight: 'bold',
    },
    subtotalSection: {
        alignItems: 'flex-end',
    },
    subtotalLbl: {
        fontSize: 10,
        color: '#70757a',
    },
    historySubtotalVal: {
        fontWeight: '700',
        color: '#28a745',
        fontSize: 13,
    },
    syncingText: {
        fontSize: 13,
        color: '#70757a',
    },
    textDark: {
        color: '#ffffff',
    },
    textMutedDark: {
        color: '#a0a0a0',
    },
});